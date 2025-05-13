import { NextRequest, NextResponse } from 'next/server';
import { analyzeCode } from '@/lib/openrouter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();
    
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }
    
    const supportedLanguages = ['c', 'cpp', 'java', 'python'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unsupported language. Supported languages are: C, C++, Java, Python' },
        { status: 400 }
      );
    }

    const result = await analyzeCode(code, language);
    
    if (result.score === 0 && result.review.errors[0].message === "Unable to analyze code") {
      return NextResponse.json(
        { error: result.review.summary },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/analyze-code:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}