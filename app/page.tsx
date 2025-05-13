'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeAnalysisResult } from '@/lib/openrouter';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector from '@/components/LanguageSelector';
import AnimatedCharacter from '@/components/AnimatedCharacter';
import CodeReview from '@/components/CodeReview';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import SampleCodeButton from '@/components/SampleCodeButton';
import { Code, Loader2, Send, Github } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CodeAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('editor');

  const analyzeCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }

      const data = await response.json();
      setResult(data);
      setActiveTab('review');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, language]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleSampleCode = (sampleCode: string) => {
    setCode(sampleCode);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Code className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Code Review</h1>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ThemeSwitcher />
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Code Input</CardTitle>
          <CardDescription>
            Enter your code below and select the language for real-time analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <LanguageSelector 
              language={language} 
              onLanguageChange={handleLanguageChange} 
              disabled={isAnalyzing} 
            />
            <SampleCodeButton 
              language={language} 
              onSelectSample={handleSampleCode} 
              disabled={isAnalyzing} 
            />
          </div>
          
          <CodeEditor 
            code={code} 
            language={language} 
            onChange={handleCodeChange} 
            isAnalyzing={isAnalyzing}
            errors={result?.review.errors}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={analyzeCode} 
            disabled={isAnalyzing || !code.trim()}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Analyze Code
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <>
          <AnimatedCharacter 
            score={result.score} 
            roast={result.roast} 
            isVisible={!!result} 
          />

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="review">Review Results</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="p-0 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Code Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeEditor 
                    code={code} 
                    language={language} 
                    onChange={handleCodeChange} 
                    isAnalyzing={isAnalyzing}
                    errors={result?.review.errors}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="review" className="p-0 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Code Review Results</CardTitle>
                  <CardDescription>
                    Detailed analysis of your code with identified issues and improvement suggestions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeReview review={result.review} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  );
}