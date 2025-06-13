import React, { useState } from 'react';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isMultiplayer?: boolean;
}

const GuessInput: React.FC<GuessInputProps> = ({ 
  onGuess, 
  disabled = false,
  placeholder = "Enter your guess...",
  isMultiplayer = false
}) => {
  const [guess, setGuess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guess.trim() || disabled || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await onGuess(guess.trim());
      setGuess('');
    } catch (error) {
      console.error('Error submitting guess:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Waiting..." : placeholder}
          disabled={disabled || isSubmitting}
          className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
            disabled || isSubmitting
              ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'border-orange-300 focus:border-orange-500 bg-white'
          }`}
          autoComplete="off"
          maxLength={50}
        />
        <button
          type="submit"
          disabled={!guess.trim() || disabled || isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !guess.trim() || disabled || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ...
            </span>
          ) : (
            '✓ Guess'
          )}
        </button>
      </form>
      
      {isMultiplayer && (
        <div className="text-xs text-gray-500 text-center">
          💡 Type your guess and press Enter or click the button
        </div>
      )}
      
      {!isMultiplayer && (
        <div className="text-xs text-orange-600 text-center">
          🎯 What did you just draw? Make your best guess!
        </div>
      )}
    </div>
  );
};

export default GuessInput; 
