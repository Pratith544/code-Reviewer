'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type CodeEditorProps = {
  code: string;
  language: string;
  onChange: (value: string) => void;
  isAnalyzing: boolean;
  errors?: Array<{
    line: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
};

export default function CodeEditor({ 
  code, 
  language, 
  onChange, 
  isAnalyzing,
  errors = []
}: CodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);

  useEffect(() => {
    // Generate line numbers based on the number of lines in the code
    const lineCount = (code.match(/\n/g) || []).length + 1;
    setLineNumbers(Array.from({ length: lineCount }, (_, i) => (i + 1).toString()));
  }, [code]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Determine appropriate class for syntax highlighting based on language
  const languageClass = {
    'c': 'language-c',
    'cpp': 'language-cpp',
    'java': 'language-java',
    'python': 'language-python',
  }[language.toLowerCase()] || 'language-plaintext';

  return (
    <div className="relative border rounded-md overflow-hidden bg-card dark:bg-card">
      <div className="flex">
        {/* Line numbers */}
        <div className="p-4 bg-muted text-muted-foreground text-right select-none w-14">
          {lineNumbers.map((num) => (
            <div 
              key={num} 
              className={cn(
                "leading-6",
                errors?.some(err => err.line === parseInt(num)) && "text-destructive font-bold"
              )}
            >
              {num}
            </div>
          ))}
        </div>
        
        {/* Code input */}
        <div className="relative flex-1">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className={cn(
              "font-mono p-4 w-full h-full min-h-[300px] resize-y bg-transparent",
              "focus:outline-none focus:ring-0 focus:border-0",
              languageClass
            )}
            spellCheck="false"
            placeholder="Enter your code here..."
            disabled={isAnalyzing}
            rows={Math.max(10, lineNumbers.length)}
          />
          
          {/* Loading overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Analyzing your code...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}