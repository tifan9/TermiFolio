import { useState, useCallback } from 'react';

export function useTerminal() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);

  const addToHistory = useCallback((command: string) => {
    setCommandHistory(prev => [command, ...prev]);
    setHistoryPosition(-1);
  }, []);

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (direction === 'up') {
      if (historyPosition < commandHistory.length - 1) {
        const newPosition = historyPosition + 1;
        setHistoryPosition(newPosition);
        return commandHistory[newPosition];
      }
    } else if (direction === 'down') {
      if (historyPosition > 0) {
        const newPosition = historyPosition - 1;
        setHistoryPosition(newPosition);
        return commandHistory[newPosition];
      } else if (historyPosition === 0) {
        setHistoryPosition(-1);
        return '';
      }
    }
    return null;
  }, [commandHistory, historyPosition]);

  return {
    commandHistory,
    historyPosition,
    addToHistory,
    navigateHistory
  };
}
