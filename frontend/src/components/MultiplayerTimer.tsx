import React, { useState, useEffect, useRef } from 'react';

interface MultiplayerTimerProps {
  timeLimit: number;
  isActive: boolean;
  roundStartTime?: number;
  onTimeUp?: () => void;
  compact?: boolean;
}

const MultiplayerTimer: React.FC<MultiplayerTimerProps> = ({
  timeLimit,
  isActive,
  roundStartTime,
  onTimeUp,
  compact = false
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isWarning, setIsWarning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const lastTickRef = useRef<number | null>(null);

  // Initialize audio context for sound effects
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window && !audioContext) {
      const context = new AudioContext();
      setAudioContext(context);
    }
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Play tick sound for last 10 seconds
  const playTickSound = (toggle: boolean) => {
    if (!audioContext) return;
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const freq = toggle ? 400 : 300;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Error playing sound
    }
  };

  // Test sound button
  const testSound = () => {
    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  // Calculate time left based on server sync
  useEffect(() => {
    if (!isActive || !roundStartTime) {
      setTimeLeft(timeLimit);
      setIsWarning(false);
      lastTickRef.current = null;
      return;
    }

    let localTickToggle = false;

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - roundStartTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);
      setIsWarning(remaining <= 10);

      // Only play sound if the second changed and it's in the last 10 seconds
      if (remaining <= 10 && remaining > 0) {
        if (lastTickRef.current !== remaining) {
          playTickSound(localTickToggle);
          localTickToggle = !localTickToggle;
          lastTickRef.current = remaining;
        }
      }

      if (remaining === 0 && onTimeUp) {
        onTimeUp();
      }
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, roundStartTime, timeLimit, onTimeUp, audioContext]);

  // Reset timer when not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(timeLimit);
      setIsWarning(false);
    }
  }, [isActive, timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = Math.max(0, (timeLeft / timeLimit) * 100);
  
  // Color based on time remaining
  const getColor = () => {
    if (timeLeft <= 10) return 'red';
    if (timeLeft <= 30) return 'orange';
    return 'green';
  };

  const color = getColor();

  if (compact) {
    return (
      <div className="text-center">
        <p className="text-xs text-gray-600 mb-1">Time</p>
        <div className={`text-lg sm:text-xl font-bold ${
          color === 'red' ? 'text-red-600' : 
          color === 'orange' ? 'text-orange-600' : 'text-green-600'
        } ${isWarning ? 'animate-pulse' : ''}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              color === 'red' ? 'bg-red-500' : 
              color === 'orange' ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <button onClick={testSound} className="mt-2 text-xs text-blue-600 hover:text-blue-800">
          Testar Som
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Round Timer</h3>
        
        <div className={`text-3xl font-bold mb-4 ${
          color === 'red' ? 'text-red-600' : 
          color === 'orange' ? 'text-orange-600' : 'text-green-600'
        } ${isWarning ? 'animate-pulse' : ''}`}>
          {formatTime(timeLeft)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              color === 'red' ? 'bg-red-500' : 
              color === 'orange' ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-sm text-gray-600">
          {isActive ? (
            timeLeft <= 10 ? (
              <span className="text-red-600 font-medium">⚠️ Hurry up!</span>
            ) : (
              <span>⏱️ Round in progress</span>
            )
          ) : (
            <span>⏸️ Timer paused</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiplayerTimer; 
