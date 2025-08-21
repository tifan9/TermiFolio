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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 640);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
      if (inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        setPosition({
          left: isMobile ? 8 : inputRect.left,
          bottom: window.innerHeight - inputRect.top + 10,
          width: isMobile ? window.innerWidth - 16 : Math.max(inputRect.width, 300)
        });
      }
    }, [inputRef, commands, isMobile]);

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
            className="px-2 sm:px-3 py-2 hover:bg-gray-700 cursor-pointer text-terminal-green transition-colors"
            onClick={() => onSelect(cmd)}
            data-testid={`suggestion-${cmd.replace('/', '')}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-mono text-sm">{cmd}</span>
              <span className="text-gray-400 text-xs sm:text-sm sm:ml-2">
                {isMobile ? '' : '- '}
                {commandDescriptions[cmd]}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

AutoSuggestions.displayName = 'AutoSuggestions';

export default AutoSuggestions;
