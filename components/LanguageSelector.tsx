'use client';

import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const languages = [
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' }
];

type LanguageSelectorProps = {
  language: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
};

export default function LanguageSelector({ 
  language, 
  onLanguageChange, 
  disabled = false 
}: LanguageSelectorProps) {
  const handleValueChange = (value: string) => {
    onLanguageChange(value);
  };

  return (
    <Select 
      value={language} 
      onValueChange={handleValueChange} 
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}