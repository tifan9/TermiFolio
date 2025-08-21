import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function Typewriter({ text, speed = 80, className = '', onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

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
      
      // Hide cursor after completion with delay
      setTimeout(() => {
        setShowCursor(false);
      }, 1000);
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <div className={`${className} inline-block`}>
      <span>{displayText}</span>
      {showCursor && <span className="animate-blink text-terminal-blue ml-1">|</span>}
    </div>
  );
}
