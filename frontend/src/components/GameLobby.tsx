import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameLobby: React.FC = () => {
  const navigate = useNavigate();
  const [roundTime, setRoundTime] = useState(60); // Default 60 seconds

  const handleStartGame = () => {
    navigate('/game', { state: { roundTime } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center mb-8">Pictionary Game</h1>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Round Time (seconds)
          </label>
          <input
            type="number"
            min="30"
            max="300"
            value={roundTime}
            onChange={(e) => setRoundTime(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-xs text-gray-500 mt-1">
            Choose between 30 and 300 seconds
          </p>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Start Drawing!
        </button>
      </div>
    </div>
  );
};

export default GameLobby; 
