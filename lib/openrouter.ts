import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": "Code Review App",
  },
});

export interface CodeAnalysisResult {
  score: number;
  roast: string;
  review: {
    errors: Array<{ line: number; message: string; severity: 'error' | 'warning' | 'info' }>;
    improvements: Array<{ line: number; message: string }>;
    summary: string;
  };
}

const defaultResult: CodeAnalysisResult = {
  score: 0,
  roast: "Code analysis failed - please try again",
  review: {
    errors: [{ line: 1, message: "Unable to analyze code", severity: "error" }],
    improvements: [],
    summary: "The code analysis service is currently experiencing issues. Please try again in a moment."
  }
};

export async function analyzeCode(
  code: string,
  language: string
): Promise<CodeAnalysisResult> {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is missing');
    return {
      ...defaultResult,
      review: {
        ...defaultResult.review,
        summary: "API key is not configured. Please check your environment variables."
      }
    };
  }

  const systemMsg = `
You are a code reviewer. Analyze the provided code and return ONLY a JSON object with this exact structure:
{
  "score": <number between 1-10>,
  "roast": "<single sentence>",
  "review": {
    "errors": [{"line": <number>, "message": "<text>", "severity": "error"|"warning"|"info"}],
    "improvements": [{"line": <number>, "message": "<text>"}],
    "summary": "<text>"
  }
}
Do not include any other text or explanation outside of this JSON structure.`.trim();

  const userMsg = `Review this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const text = completion.choices?.[0]?.message?.content;
    if (!text) {
      console.error('Empty response from OpenRouter');
      return defaultResult;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text.trim());
    } catch (parseErr) {
      console.error('Failed to parse JSON response:', text);
      return defaultResult;
    }

    // Validate and sanitize the response
    const validatedResult: CodeAnalysisResult = {
      score: typeof parsed.score === 'number' ? Math.max(0, Math.min(10, parsed.score)) : 0,
      roast: typeof parsed.roast === 'string' ? parsed.roast : defaultResult.roast,
      review: {
        errors: Array.isArray(parsed.review?.errors) 
          ? parsed.review.errors.map((error: any) => ({
              line: Math.max(1, parseInt(error.line) || 1),
              message: String(error.message || ''),
              severity: ['error', 'warning', 'info'].includes(error.severity) 
                ? error.severity 
                : 'info'
            }))
          : defaultResult.review.errors,
        improvements: Array.isArray(parsed.review?.improvements)
          ? parsed.review.improvements.map((imp: any) => ({
              line: Math.max(1, parseInt(imp.line) || 1),
              message: String(imp.message || '')
            }))
          : defaultResult.review.improvements,
        summary: typeof parsed.review?.summary === 'string' 
          ? parsed.review.summary 
          : defaultResult.review.summary
      }
    };

    return validatedResult;
  } catch (error) {
    console.error('Error in analyzeCode:', error);
    return {
      ...defaultResult,
      review: {
        ...defaultResult.review,
        summary: error instanceof Error 
          ? `Analysis failed: ${error.message}`
          : defaultResult.review.summary
      }
    };
  }
}