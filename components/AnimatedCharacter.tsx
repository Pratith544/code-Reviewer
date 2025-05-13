'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookCheck, 
  Flame, 
  ThumbsDown, 
  ThumbsUp, 
  Award, 
  Meh, 
  Frown,
  Laugh,
  Construction,
  Lightbulb
} from 'lucide-react';

type AnimatedCharacterProps = {
  score: number;
  roast: string;
  isVisible: boolean;
};

export default function AnimatedCharacter({ 
  score, 
  roast, 
  isVisible 
}: AnimatedCharacterProps) {
  const [icon, setIcon] = useState(<Meh />);
  const [characterColor, setCharacterColor] = useState('text-amber-500');

  useEffect(() => {
    // Set icon based on score
    if (score >= 9) {
      setIcon(<Award className="w-12 h-12" />);
      setCharacterColor('text-emerald-500');
    } else if (score >= 7) {
      setIcon(<ThumbsUp className="w-12 h-12" />);
      setCharacterColor('text-emerald-400');
    } else if (score >= 5) {
      setIcon(<Lightbulb className="w-12 h-12" />);
      setCharacterColor('text-amber-400');
    } else if (score >= 3) {
      setIcon(<Construction className="w-12 h-12" />);
      setCharacterColor('text-amber-500');
    } else if (score >= 1) {
      setIcon(<ThumbsDown className="w-12 h-12" />);
      setCharacterColor('text-red-400');
    } else {
      setIcon(<Flame className="w-12 h-12" />);
      setCharacterColor('text-red-500');
    }
  }, [score]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex items-center p-4 bg-card rounded-lg shadow-md mb-6"
        >
          <motion.div 
            className={`flex-shrink-0 ${characterColor}`}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon}
          </motion.div>
          <motion.div 
            className="ml-4 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-xl font-bold">Score: {score}/10</div>
            <motion.div 
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              "{roast}"
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}