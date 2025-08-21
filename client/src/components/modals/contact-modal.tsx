import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; message: string; captcha: number }) => Promise<void>;
  captchaQuestion: string;
  isLoading: boolean;
}

export default function ContactModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  captchaQuestion, 
  isLoading 
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    captcha: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit({
        ...formData,
        captcha: parseInt(formData.captcha)
      });
      setFormData({ name: '', email: '', message: '', captcha: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="terminal-gray border-gray-600 text-terminal-text max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-terminal-blue text-lg sm:text-xl">Contact Sophie</DialogTitle>
          <DialogDescription className="text-gray-400">
            Send a message to Sophie. Please solve the CAPTCHA to prevent spam.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300 text-sm">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              className="bg-terminal-bg border-gray-600 text-terminal-text font-mono text-sm"
              required
              data-testid="input-contact-name"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className="bg-terminal-bg border-gray-600 text-terminal-text font-mono text-sm"
              required
              data-testid="input-contact-email"
            />
          </div>
          
          <div>
            <Label htmlFor="message" className="text-gray-300 text-sm">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={handleInputChange('message')}
              className="bg-terminal-bg border-gray-600 text-terminal-text font-mono h-20 sm:h-24 text-sm"
              required
              data-testid="textarea-contact-message"
            />
          </div>
          
          <div>
            <Label htmlFor="captcha" className="text-gray-300 text-sm">
              CAPTCHA: What is <span className="text-terminal-blue">{captchaQuestion}</span>?
            </Label>
            <Input
              id="captcha"
              type="number"
              value={formData.captcha}
              onChange={handleInputChange('captcha')}
              className="bg-terminal-bg border-gray-600 text-terminal-text font-mono text-sm"
              required
              data-testid="input-contact-captcha"
            />
          </div>
          
          {error && (
            <div className="text-terminal-red text-xs sm:text-sm" data-testid="text-error-message">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-terminal-blue text-white hover:bg-blue-600 transition-colors text-sm sm:text-base"
            data-testid="button-send-message"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
