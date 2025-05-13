'use client';

import React from 'react';
import { CodeAnalysisResult } from '@/lib/openrouter';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  LightbulbIcon,
  CheckCircle2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CodeReview({ review }: { review: CodeAnalysisResult['review'] }) {
  if (!review) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Summary */}
      <motion.div variants={item}>
        <Alert>
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-xl font-semibold mb-2">Review Summary</AlertTitle>
          <AlertDescription>
            {review.summary}
          </AlertDescription>
        </Alert>
      </motion.div>

      <Separator />

      {/* Errors and Warnings */}
      {review.errors.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h3 className="text-lg font-semibold">Issues</h3>
          {review.errors.map((error, index) => (
            <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
              {getSeverityIcon(error.severity)}
              <AlertTitle className="font-medium">
                Line {error.line}: {error.severity.toUpperCase()}
              </AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          ))}
        </motion.div>
      )}

      <Separator />

      {/* Improvements */}
      {review.improvements.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h3 className="text-lg font-semibold">Suggested Improvements</h3>
          {review.improvements.map((improvement, index) => (
            <Alert key={index}>
              <LightbulbIcon className="h-5 w-5 text-amber-500" />
              <AlertTitle className="font-medium">
                Line {improvement.line}
              </AlertTitle>
              <AlertDescription>
                {improvement.message}
              </AlertDescription>
            </Alert>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}