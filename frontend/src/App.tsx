import React, { useState, useRef, useEffect } from 'react';
import Canvas, { CanvasRef } from './components/Canvas';
import GuessInput from './components/GuessInput';
import MultiplayerTimer from './components/MultiplayerTimer';
import PlayerAvatar from './components/PlayerAvatar';
import { generateRandomProfile, RandomProfile } from './utils/randomProfile';
import GameControls from './components/GameControls';
import GuessList from './components/GuessList';

interface Guess {
  id: string;
  playerName: string;
  guess: string;
  isCorrect?: boolean;
  timestamp: number;
}

const WORDS = [
  "house", "car", "cat", "dog", "tree", "flower", "sun", "moon", "star", "fish",
  "bird", "book", "phone", "computer", "chair", "table", "window", "door", "key", "clock",
  "bicycle", "airplane", "boat", "train", "bus", "road", "bridge", "mountain", "river", "ocean",
  "pizza", "burger", "cake", "apple", "banana", "guitar", "piano", "camera", "ball", "game"
];

const App: React.FC = () => {
  const [playerProfile, setPlayerProfile] = useState<RandomProfile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number | undefined>();
  const [timeLimit, setTimeLimit] = useState(60);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<CanvasRef>(null);
  const [showLobby, setShowLobby] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    if (!playerProfile) {
      setPlayerProfile(generateRandomProfile());
    }
  }, []);

  useEffect(() => {
    const savedScore = localStorage.getItem('score');
    if (savedScore) {
      setScore(Number(savedScore));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('score', String(score));
  }, [score]);

  const fetchRandomWord = async () => {
    const res = await fetch('http://localhost:8000/word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ round_time: 60 })
    });
    const data = await res.json();
    return data.word;
  };

  const handleStartGame = (selectedTime: number) => {
    setTimeLimit(selectedTime);
    setShowLobby(false);
    startGame(selectedTime);
  };

  const startGame = async (customTimeLimit?: number) => {
    const word = await fetchRandomWord();
    setCurrentWord(word);
    setIsPlaying(true);
    setRoundStartTime(Date.now());
    setGuesses([]);
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
    if (customTimeLimit) {
      setTimeLimit(customTimeLimit);
    }
  };

  const handleNewRound = async () => {
    setShowGameOver(false);
    const word = await fetchRandomWord();
    setCurrentWord(word);
    setIsPlaying(true);
    setRoundStartTime(Date.now());
    setGuesses([]);
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleGuess = (guess: string) => {
    const isCorrect = guess.trim().toLowerCase() === currentWord.toLowerCase();
    setGuesses(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        playerName: playerProfile?.name || 'You',
        guess,
        isCorrect,
        timestamp: Date.now()
      }
    ]);
    if (isCorrect) {
      setScore(s => s + 10);
      setIsPlaying(false);
      setShowGameOver(true);
    }
  };

  const handleRoundEnded = () => {
    setIsPlaying(false);
    setShowGameOver(true);
    setGuesses(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        playerName: 'System',
        guess: `Time's up! The word was: ${currentWord}`,
        isCorrect: false,
        timestamp: Date.now()
      }
    ]);
  };

  const handleBackToLobby = () => {
    setShowGameOver(false);
    setShowLobby(true);
    setScore(0);
    localStorage.removeItem('score');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {showLobby ? (
          <GameControls onNewGame={handleStartGame} isPlaying={isPlaying} />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              {playerProfile && (
                <PlayerAvatar
                  name={playerProfile.name}
                  color={playerProfile.color}
                  emoji={playerProfile.emoji}
                  initials={playerProfile.initials}
                  score={score}
                  isActive={isPlaying}
                  size="md"
                />
              )}
              {!isPlaying && !showGameOver && (
                <button
                  className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
                  onClick={handleNewRound}
                >
                  New Round
                </button>
              )}
            </div>

            {showGameOver ? (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Round Finished!</h2>
                <p className="text-gray-600 mb-6">
                  The word was: <span className="font-bold text-indigo-600">{currentWord}</span>
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleNewRound}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                  >
                    Continue Playing
                  </button>
                  <button
                    onClick={handleBackToLobby}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
                  >
                    Back to Lobby
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Word</p>
                      <p className="text-lg sm:text-xl font-bold text-indigo-600">
                        {isPlaying ? currentWord : '???'}
                      </p>
                    </div>
                    <MultiplayerTimer
                      timeLimit={timeLimit}
                      isActive={isPlaying}
                      roundStartTime={roundStartTime}
                      compact
                      onTimeUp={handleRoundEnded}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <Canvas
                      ref={canvasRef}
                      onDrawData={() => {}}
                      onClearCanvas={() => {}}
                      isDrawer={true}
                      disabled={!isPlaying}
                    />
                  </div>
                  <div className="space-y-6">
                    <GuessList
                      guesses={guesses}
                      currentPlayerName={playerProfile?.name || 'You'}
                    />
                    {isPlaying && (
                      <GuessInput
                        onGuess={handleGuess}
                        disabled={!isPlaying}
                        isMultiplayer={false}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App; 
