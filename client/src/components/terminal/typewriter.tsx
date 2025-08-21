import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function Typewriter({ text, speed = 50, className = '', onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
      
      // Remove cursor after completion
      setTimeout(() => {
        setDisplayText(text);
      }, 1000);
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <div className={`${className} ${!isComplete ? 'animate-typing' : ''}`}>
      {displayText}
      {!isComplete && <span className="animate-blink text-terminal-blue">|</span>}
    </div>
  );
}
