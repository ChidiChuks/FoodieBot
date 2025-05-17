
import React from 'react';
import { cn } from '@/lib/utils';

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  timestamp: string;
};

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] px-4 py-2 shadow-sm",
          isUser ? "chat-bubble-user" : "chat-bubble-bot"
        )}
      >
        <p>{message}</p>
        <p className={cn(
          "text-xs mt-1",
          isUser ? "text-white/70" : "text-gray-500"
        )}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
