import { useEffect } from 'react';
import TerminalInterface from '@/components/terminal/terminal-interface';

export default function Terminal() {
  useEffect(() => {
    document.title = 'Sophie Uwase - Portfolio Terminal';
  }, []);

  return (
    <div className="h-screen bg-terminal-bg text-terminal-text font-mono overflow-hidden">
      <TerminalInterface />
    </div>
  );
}
