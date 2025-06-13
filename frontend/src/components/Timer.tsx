import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  timeLimit: number;
  isActive: boolean;
  onTimeUp: () => void;
  onTick?: (timeLeft: number) => void;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, isActive, onTimeUp, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create beep sound using Web Audio API
  const createBeepSound = (frequency: number = 800, duration: number = 100) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  };

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Play tick sound in last 10 seconds
          if (newTime <= 10 && newTime > 0) {
            createBeepSound(600, 150);
          }
          
          // Call onTick callback
          if (onTick) {
            onTick(newTime);
          }
          
          // Time's up
          if (newTime <= 0) {
            onTimeUp();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, onTimeUp, onTick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (timeLeft <= 10) return 'text-red-600 animate-pulse';
    if (timeLeft <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressPercentage = () => {
    return ((timeLimit - timeLeft) / timeLimit) * 100;
  };

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">Timer</p>
      <div className={`text-2xl font-bold ${getColorClass()}`}>
        {formatTime(timeLeft)}
      </div>
      
      {/* Compact Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft <= 10 ? 'bg-red-500' : 
            timeLeft <= 30 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      
      {/* Compact Status */}
      <div className="text-xs text-gray-500 mt-1">
        {!isActive && timeLeft === timeLimit && 'Ready'}
        {!isActive && timeLeft < timeLimit && timeLeft > 0 && 'Paused'}
        {!isActive && timeLeft === 0 && 'Time\'s up!'}
        {isActive && timeLeft <= 10 && 'Hurry up!'}
        {isActive && timeLeft > 10 && 'Drawing...'}
      </div>
    </div>
  );
};

export default Timer; 
