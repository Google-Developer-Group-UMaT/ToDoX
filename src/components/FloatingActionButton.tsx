
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  );
};

export default FloatingActionButton;
