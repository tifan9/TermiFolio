import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import Typewriter from './typewriter';
import AutoSuggestions from './auto-suggestions';
import ContactModal from '@/components/modals/contact-modal';
import VideoModal from '@/components/modals/video-modal';
import { useTerminal } from '@/hooks/use-terminal';

interface TerminalOutput {
  id: string;
  content: string;
  className?: string;
}

const commands = {
  '/help': 'Show available commands',
  '/cv': 'Display CV and experience',
  '/intro': 'Play introduction video',
  '/profiles': 'Show social media profiles',
  '/contact': 'Open contact form',
  '/journal': 'Display blog posts',
  '/ask': 'Ask questions about Sophie',
  '/clear': 'Clear terminal screen'
};

export default function TerminalInterface() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 3, num2: 7 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { 
    commandHistory, 
    historyPosition, 
    addToHistory, 
    navigateHistory 
  } = useTerminal();

  // Queries
  const cvQuery = useQuery({
    queryKey: ['/api/cv'],
    enabled: false
  });

  const journalQuery = useQuery({
    queryKey: ['/api/journal'],
    enabled: false
  });

  const profilesQuery = useQuery({
    queryKey: ['/api/profiles'],
    enabled: false
  });

  // Mutations
  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    }
  });

  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) throw new Error('Failed to process question');
      return response.json();
    }
  });

  const addOutput = (content: string, className = '') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setOutput(prev => [...prev, { id, content, className }]);
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 100);
  };

  const showPrompt = (command: string) => {
    addOutput(`<span class="text-terminal-green">sophie@portfolio:~$</span> ${command}`, 'mb-2');
  };

  const getMatchingCommands = (input: string) => {
    return Object.keys(commands).filter(cmd => 
      cmd.toLowerCase().includes(input.toLowerCase()) && input.length > 0
    );
  };

  const executeCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    showPrompt(command);
    addToHistory(command);
    
    switch(cmd) {
      case '/help':
        let helpOutput = '<div class="text-terminal-blue mb-2">Available Commands:</div>';
        Object.entries(commands).forEach(([cmd, desc]) => {
          helpOutput += `<div class="mb-1"><span class="text-terminal-green">${cmd}</span> - ${desc}</div>`;
        });
        addOutput(helpOutput, 'mb-4');
        break;
        
      case '/cv':
        try {
          const cvData = await queryClient.fetchQuery({ queryKey: ['/api/cv'] });
          let cvOutput = `<div class="text-terminal-blue text-lg mb-3">${cvData.name} - CV</div>`;
          cvOutput += `<div class="mb-3"><span class="text-terminal-green">Contact:</span> ${cvData.contact.email} | ${cvData.contact.phone}</div>`;
          
          cvOutput += '<div class="text-terminal-purple mb-2">Experience:</div>';
          cvData.experience.forEach((exp: any) => {
            cvOutput += `<div class="mb-3 pl-4">`;
            cvOutput += `<div class="text-white font-semibold">${exp.role} - ${exp.organization}</div>`;
            cvOutput += `<div class="text-gray-400 text-sm">${exp.location} | ${exp.period}</div>`;
            exp.achievements.forEach((achievement: string) => {
              cvOutput += `<div class="text-sm mt-1">• ${achievement}</div>`;
            });
            cvOutput += '</div>';
          });
          
          cvOutput += '<div class="text-terminal-purple mb-2">Skills:</div>';
          cvOutput += `<div class="pl-4 mb-2">`;
          cvOutput += `<div class="mb-1"><span class="text-terminal-green">Technical:</span> ${cvData.skills.technical.join(', ')}</div>`;
          cvOutput += `<div class="mb-1"><span class="text-terminal-green">Soft Skills:</span> ${cvData.skills.soft.join(', ')}</div>`;
          cvOutput += `<div><span class="text-terminal-green">Languages:</span> ${cvData.skills.languages.join(', ')}</div>`;
          cvOutput += '</div>';
          
          addOutput(cvOutput, 'mb-4');
        } catch (error) {
          addOutput('<div class="text-terminal-red">Failed to load CV data</div>', 'mb-4');
        }
        break;
        
      case '/intro':
        addOutput('<div class="text-terminal-blue mb-2">Opening introduction video...</div>', 'mb-4');
        setVideoModalOpen(true);
        break;
        
      case '/profiles':
        try {
          const profiles = await queryClient.fetchQuery({ queryKey: ['/api/profiles'] });
          let profilesOutput = '<div class="text-terminal-blue mb-2">Social Media Profiles:</div>';
          Object.entries(profiles).forEach(([platform, url]) => {
            profilesOutput += `<div class="mb-1">• <a href="${url}" target="_blank" class="text-terminal-green hover:underline">${platform}</a></div>`;
          });
          addOutput(profilesOutput, 'mb-4');
        } catch (error) {
          addOutput('<div class="text-terminal-red">Failed to load profiles</div>', 'mb-4');
        }
        break;
        
      case '/contact':
        addOutput('<div class="text-terminal-blue mb-2">Opening contact form...</div>', 'mb-4');
        // Generate random CAPTCHA
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        setCaptchaQuestion({ num1, num2 });
        setContactModalOpen(true);
        break;
        
      case '/journal':
        try {
          const entries = await queryClient.fetchQuery({ queryKey: ['/api/journal'] });
          let journalOutput = '<div class="text-terminal-blue mb-3">Recent Journal Entries:</div>';
          entries.forEach((entry: any) => {
            journalOutput += `<div class="mb-4 pl-4 border-l-2 border-terminal-green">`;
            journalOutput += `<div class="text-white font-semibold">${entry.title}</div>`;
            journalOutput += `<div class="text-gray-400 text-sm mb-2">${entry.date}</div>`;
            journalOutput += `<div class="text-sm">${entry.content}</div>`;
            journalOutput += '</div>';
          });
          addOutput(journalOutput, 'mb-4');
        } catch (error) {
          addOutput('<div class="text-terminal-red">Failed to load journal entries</div>', 'mb-4');
        }
        break;
        
      case '/clear':
        setOutput([]);
        break;
        
      default:
        if (cmd.startsWith('/ask ')) {
          const question = command.substring(5).trim();
          try {
            const response = await askMutation.mutateAsync(question);
            addOutput(`<div class="text-terminal-blue mb-2">AI Assistant:</div><div class="pl-4">${response.response}</div>`, 'mb-4');
          } catch (error) {
            addOutput('<div class="text-terminal-red">Failed to process question</div>', 'mb-4');
          }
        } else {
          addOutput(`<div class="text-terminal-red">Command not found: ${command}</div><div class="text-gray-400">Type /help to see available commands.</div>`, 'mb-4');
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      if (command) {
        executeCommand(command);
      }
      setInput('');
      setShowSuggestions(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matchingCommands = getMatchingCommands(input);
      if (matchingCommands.length === 1) {
        setInput(matchingCommands[0]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const historyCommand = navigateHistory('up');
      if (historyCommand !== null) {
        setInput(historyCommand);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const historyCommand = navigateHistory('down');
      if (historyCommand !== null) {
        setInput(historyCommand);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(value.length > 0 && getMatchingCommands(value).length > 0);
  };

  const selectSuggestion = (command: string) => {
    setInput(command);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleContactSubmit = async (data: { name: string; email: string; message: string; captcha: number }) => {
    if (data.captcha !== captchaQuestion.num1 + captchaQuestion.num2) {
      throw new Error('Incorrect CAPTCHA answer');
    }
    
    await contactMutation.mutateAsync(data);
    addOutput('<div class="text-terminal-green">Message sent successfully! Sophie will get back to you soon.</div>', 'mb-4');
    setContactModalOpen(false);
  };

  // Focus input when clicking anywhere
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!contactModalOpen && !videoModalOpen) {
        inputRef.current?.focus();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) && e.target !== inputRef.current) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contactModalOpen, videoModalOpen]);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Title Bar */}
      <div className="terminal-gray border-b border-gray-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-sm text-gray-400">sophie@portfolio:~</div>
        <div className="w-16"></div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Output Area */}
        <div 
          ref={outputRef}
          className="flex-1 overflow-y-auto p-4 space-y-1 terminal-scrollbar"
          data-testid="terminal-output"
        >
          {/* Welcome Message */}
          <div className="mb-4">
            <div className="text-terminal-green mb-2">
              ╭─ Welcome to Sophie Uwase's Portfolio Terminal ─╮
            </div>
            <Typewriter 
              text="Hello! I'm Sophie, a passionate Web Developer and IT Professional from Rwanda."
              className="text-terminal-blue mb-2"
              speed={50}
            />
            <div className="text-terminal-green mb-4">
              ╰─────────────────────────────────────────────────╯
            </div>
            <div className="text-gray-400 text-sm mb-4">
              Type <span className="text-terminal-blue">/help</span> to see available commands, or start typing to see suggestions.
            </div>
          </div>
          
          {/* Command Output */}
          {output.map((item) => (
            <div 
              key={item.id} 
              className={item.className}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ))}
        </div>

        {/* Auto-suggestions */}
        {showSuggestions && (
          <AutoSuggestions
            ref={suggestionsRef}
            commands={getMatchingCommands(input)}
            commandDescriptions={commands}
            onSelect={selectSuggestion}
            inputRef={inputRef}
          />
        )}

        {/* Input Area */}
        <div className="border-t border-gray-600 p-4">
          <div className="flex items-center">
            <span className="text-terminal-green mr-2">sophie@portfolio:~$</span>
            <div className="flex-1 relative">
              <input 
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-terminal-text w-full font-mono"
                autoComplete="off"
                placeholder="Type a command..."
                data-testid="terminal-input"
              />
              <span className="absolute text-terminal-blue animate-blink pointer-events-none">|</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSubmit={handleContactSubmit}
        captchaQuestion={`${captchaQuestion.num1} + ${captchaQuestion.num2}`}
        isLoading={contactMutation.isPending}
      />
      
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
}
