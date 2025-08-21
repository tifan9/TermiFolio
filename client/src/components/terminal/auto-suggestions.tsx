import { forwardRef, useEffect, useState } from 'react';

interface AutoSuggestionsProps {
  commands: string[];
  commandDescriptions: Record<string, string>;
  onSelect: (command: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const AutoSuggestions = forwardRef<HTMLDivElement, AutoSuggestionsProps>(
  ({ commands, commandDescriptions, onSelect, inputRef }, ref) => {
    const [position, setPosition] = useState({ left: 0, bottom: 0, width: 0 });

    useEffect(() => {
      if (inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        setPosition({
          left: inputRect.left,
          bottom: window.innerHeight - inputRect.top + 10,
          width: inputRect.width
        });
      }
    }, [inputRef, commands]);

    if (commands.length === 0) return null;

    return (
      <div
        ref={ref}
        className="fixed bg-terminal-gray border border-gray-600 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto animate-fadeIn"
        style={{
          left: position.left,
          bottom: position.bottom,
          width: position.width
        }}
        data-testid="suggestions-dropdown"
      >
        {commands.map(cmd => (
          <div
            key={cmd}
            className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-terminal-green transition-colors"
            onClick={() => onSelect(cmd)}
            data-testid={`suggestion-${cmd.replace('/', '')}`}
          >
            {cmd} <span className="text-gray-400 text-sm">- {commandDescriptions[cmd]}</span>
          </div>
        ))}
      </div>
    );
  }
);

AutoSuggestions.displayName = 'AutoSuggestions';

export default AutoSuggestions;
