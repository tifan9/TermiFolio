import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setShowIntro(false);
            return 0;
          }
          return prev + 2;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    setShowIntro(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const introText = [
    "Hi there! I'm Sophie Uwase 👋",
    "A passionate Web Developer and IT Professional from Kigali, Rwanda",
    "I specialize in creating innovative web solutions and managing IT infrastructure",
    "Currently pursuing my Bachelor's in Networks and Communication Systems at AUCA",
    "I've worked with organizations like IOM, Career Access Africa, and KADC",
    "My expertise includes web development, network administration, and system troubleshooting",
    "I'm always excited to take on new challenges and learn emerging technologies",
    "Feel free to explore my portfolio using the terminal commands!",
    "Type /help to see all available commands",
    "Thank you for visiting! 🚀"
  ];

  const currentTextIndex = Math.floor((progress / 100) * introText.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="terminal-gray border-gray-600 text-terminal-text max-w-2xl mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-terminal-blue text-lg sm:text-xl">Sophie's Introduction</DialogTitle>
          <DialogDescription className="text-gray-400">
            Get to know Sophie through this interactive introduction
          </DialogDescription>
        </DialogHeader>
        
        <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-700 flex flex-col items-center justify-center relative overflow-hidden" data-testid="video-player">
          {!showIntro ? (
            <div className="text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-terminal-blue/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-terminal-blue ml-1" />
              </div>
              <h3 className="text-terminal-blue text-lg sm:text-xl font-semibold mb-2">Sophie's Introduction</h3>
              <p className="text-gray-400 text-sm mb-6">Click play to start the introduction</p>
              <Button 
                onClick={handlePlay}
                className="bg-terminal-blue hover:bg-blue-600 text-white px-6 py-2"
                data-testid="button-play-video"
              >
                <Play className="w-4 h-4 mr-2" />
                Play Introduction
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="flex-1 flex items-center justify-center">
                <div className="max-w-lg">
                  <div className="w-24 h-24 bg-terminal-blue/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl">👩‍💻</span>
                  </div>
                  <p className="text-terminal-text text-base sm:text-lg leading-relaxed animate-fadeIn">
                    {introText[Math.min(currentTextIndex, introText.length - 1)]}
                  </p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="w-full mt-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Button
                    onClick={isPlaying ? handlePause : handlePlay}
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600"
                    data-testid="button-play-pause"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-terminal-blue h-1 rounded-full transition-all duration-200" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1 text-center">
                  {Math.floor(progress)}% complete
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
