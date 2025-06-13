import React, { useEffect, useRef } from 'react';

interface Guess {
  id: string;
  playerName: string;
  guess: string;
  isCorrect?: boolean;
  timestamp: number;
}

interface GuessListProps {
  guesses: Guess[];
  currentPlayerName: string;
}

const GuessList: React.FC<GuessListProps> = ({ guesses, currentPlayerName }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [guesses]);

  if (guesses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 h-64">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Guesses</h3>
        <div className="flex items-center justify-center h-40 text-gray-400">
          <div className="text-center">
            <p className="text-sm">No guesses yet...</p>
            <p className="text-xs mt-1">Try to guess your drawing!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-64">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        Guesses ({guesses.length})
      </h3>
      <div 
        ref={scrollRef}
        className="space-y-2 h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {guesses.map((guess) => (
          <div
            key={guess.id}
            className={`p-2 rounded-lg text-sm ${
              guess.isCorrect
                ? 'bg-green-100 border border-green-300'
                : guess.playerName === currentPlayerName
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className={`font-medium ${
                  guess.isCorrect
                    ? 'text-green-700'
                    : guess.playerName === currentPlayerName
                      ? 'text-blue-700'
                      : 'text-gray-700'
                }`}>
                  {guess.playerName}
                  {guess.playerName === currentPlayerName && ' (You)'}
                </span>
                <p className={`${
                  guess.isCorrect
                    ? 'text-green-600 font-bold'
                    : 'text-gray-600'
                }`}>
                  {guess.guess}
                  {guess.isCorrect && ' ✅'}
                </p>
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {new Date(guess.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuessList; 
