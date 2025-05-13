'use client';

import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

const sampleCodes = {
  c: `#include <stdio.h>

int main() {
    int n = 10;
    int sum = 0;
    
    for (int i = 1; i <= n; i++) {
        sum = sum + i;
    }
    
    printf("Sum of first %d numbers is %d\\n", n, sum);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int i = 0; i < nums.size(); i++) {
        sum += nums[i];
    }
    
    cout << "Sum: " << sum << endl;
    return 0;
}`,
  java: `public class HelloWorld {
    public static void main(String[] args) {
        int[] numbers = {5, 10, 15, 20, 25};
        int sum = 0;
        
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        
        System.out.println("The sum is: " + sum);
    }
}`,
  python: `def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * calculate_factorial(n-1)

number = 5
result = calculate_factorial(number)
print(f"The factorial of {number} is {result}")
`,
};

type SampleCodeButtonProps = {
  language: string;
  onSelectSample: (code: string) => void;
  disabled?: boolean;
};

export default function SampleCodeButton({ 
  language, 
  onSelectSample, 
  disabled = false 
}: SampleCodeButtonProps) {
  const handleClick = () => {
    const code = sampleCodes[language as keyof typeof sampleCodes] || '';
    onSelectSample(code);
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={disabled || !sampleCodes[language as keyof typeof sampleCodes]}
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
    >
      <Code className="h-4 w-4" />
      <span>Load Sample</span>
    </Button>
  );
}