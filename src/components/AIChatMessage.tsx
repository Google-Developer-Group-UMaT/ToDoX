
import React from 'react';
import { cn } from '@/lib/utils';

interface AIChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatMessage = ({ content, isUser, timestamp }: AIChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-todo-accent text-foreground rounded-tl-none"
      )}>
        <p className="text-sm">{content}</p>
        <span className="text-xs opacity-70 block mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default AIChatMessage;
