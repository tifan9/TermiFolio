import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="terminal-gray border-gray-600 text-terminal-text max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-terminal-blue">Introduction Video</DialogTitle>
        </DialogHeader>
        
        <div className="aspect-video bg-black rounded flex items-center justify-center" data-testid="video-placeholder">
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">🎥</div>
            <div className="mb-2">Video placeholder</div>
            <div className="text-sm">Integration with video player component needed</div>
            <div className="text-xs mt-2 text-gray-500">
              Replace this with actual video content or embed
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
