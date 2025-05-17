
import React from 'react';
import { Button } from '@/components/ui/button';

type SuggestionButtonProps = {
  text: string;
  onClick: () => void;
};

const SuggestionButton = ({ text, onClick }: SuggestionButtonProps) => {
  return (
    <Button
      variant="outline"
      className="bg-restaurant-muted text-restaurant-dark border-restaurant-secondary/20 hover:bg-restaurant-primary hover:text-white transition-all duration-300"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default SuggestionButton;
