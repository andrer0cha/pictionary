import React, { useState } from 'react';

interface GameControlsProps {
  onNewGame: (timeLimit: number) => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onNewGame, isPlaying }) => {
  const [selectedTime, setSelectedTime] = useState(60);

  const timeOptions = [
    { value: 30, label: '30 seconds', emoji: '⚡' },
    { value: 60, label: '1 minute', emoji: '⏱️' },
    { value: 90, label: '1.5 minutes', emoji: '🕐' },
    { value: 120, label: '2 minutes', emoji: '🕑' },
    { value: 180, label: '3 minutes', emoji: '🕒' },
  ];

  const handleStart = () => {
    onNewGame(selectedTime);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose time limit:
        </label>
        <div className="space-y-2">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTime(option.value)}
              className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                selectedTime === option.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              <span className="text-lg mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={isPlaying}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors ${
          isPlaying
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {isPlaying ? 'Game in Progress...' : '🎮 Start Drawing!'}
      </button>

      <div className="text-center text-sm text-gray-600 space-y-1">
        <p>🎨 Draw the word that appears</p>
        <p>🤔 Then guess what you drew</p>
        <p>🏆 Earn 10 points for correct guesses</p>
      </div>
    </div>
  );
};

export default GameControls; 
