import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface GameState {
  word: string;
  guess: string;
  score: number;
  roundTime: number;
  timeLeft: number;
  isDrawing: boolean;
  guessHistory: string[];
}

const Game: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    guess: '',
    score: 0,
    roundTime: location.state?.roundTime || 60,
    timeLeft: location.state?.roundTime || 60,
    isDrawing: true,
    guessHistory: []
  });

  useEffect(() => {
    fetchWord();
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 0) {
          clearInterval(timer);
          return { ...prev, isDrawing: false };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchWord = async () => {
    try {
      const response = await fetch('http://localhost:8000/word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ round_time: gameState.roundTime })
      });
      const data = await response.json();
      setGameState(prev => ({ ...prev, word: data.word }));
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  };

  const handleGuess = () => {
    const isCorrect = gameState.guess.toLowerCase() === gameState.word.toLowerCase();
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : prev.score,
      guessHistory: [...prev.guessHistory, gameState.guess],
      guess: ''
    }));
  };

  const startNewRound = () => {
    setGameState(prev => ({
      ...prev,
      word: '',
      guess: '',
      timeLeft: prev.roundTime,
      isDrawing: true,
      guessHistory: []
    }));
    fetchWord();
  };

  const returnToLobby = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Score: {gameState.score}</h2>
            <div className="text-xl">Time Left: {gameState.timeLeft}s</div>
          </div>

          <div className="mb-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="border border-gray-300 rounded-lg w-full"
            />
          </div>

          {!gameState.isDrawing && (
            <div className="mb-4">
              <input
                type="text"
                value={gameState.guess}
                onChange={(e) => setGameState(prev => ({ ...prev, guess: e.target.value }))}
                placeholder="Enter your guess"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleGuess}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit Guess
              </button>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={startNewRound}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              New Round
            </button>
            <button
              onClick={returnToLobby}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Return to Lobby
            </button>
          </div>

          {gameState.guessHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Guess History:</h3>
              <ul>
                {gameState.guessHistory.map((guess, index) => (
                  <li key={index}>{guess}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game; 
