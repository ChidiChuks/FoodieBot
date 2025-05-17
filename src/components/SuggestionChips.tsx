
import React from 'react';
import SuggestionButton from './SuggestionButton';

type SuggestionChipsProps = {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
};

const SuggestionChips = ({ suggestions, onSuggestionClick }: SuggestionChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {suggestions.map((suggestion, index) => (
        <SuggestionButton
          key={index}
          text={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
        />
      ))}
    </div>
  );
};

export default SuggestionChips;
