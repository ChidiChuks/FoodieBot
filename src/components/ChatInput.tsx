
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, Mic } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="flex-shrink-0 border-restaurant-muted"
      >
        <Mic className="h-5 w-5 text-restaurant-primary" />
      </Button>
      
      <div className="relative flex-grow">
        <Input
          placeholder="Ask about our menu or place an order..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="pr-10 focus-visible:ring-restaurant-primary"
        />
      </div>
      
      <Button
        type="submit"
        className="flex-shrink-0 bg-restaurant-primary hover:bg-restaurant-secondary"
        disabled={!message.trim()}
      >
        <SendIcon className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
