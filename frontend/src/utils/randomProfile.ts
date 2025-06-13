const adjectives = [
  'Happy', 'Swift', 'Creative', 'Clever', 'Fun',
  'Bright', 'Agile', 'Radiant', 'Smart', 'Lively',
  'Curious', 'Kind', 'Calm', 'Strong', 'Sweet'
];

const nouns = [
  'Panda', 'Lion', 'Tiger', 'Cat', 'Dog',
  'Rabbit', 'Wolf', 'Fox', 'Bear', 'Monkey',
  'Penguin', 'Giraffe', 'Elephant', 'Owl', 'Koala'
];

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F',
  '#E74C3C', '#2ECC71', '#E67E22', '#BE90D4', '#87D37C'
];

const emojis = [
  '🐼', '🦁', '🐯', '🐱', '🐶',
  '🐰', '🐺', '🦊', '🐻', '🐵',
  '🐧', '🦒', '🐘', '🦉', '🐨'
];

export interface RandomProfile {
  name: string;
  color: string;
  emoji: string;
  initials: string;
}

export const generateRandomProfile = (): RandomProfile => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  const name = `${adjective} ${noun}`;
  const initials = `${adjective[0]}${noun[0]}`;

  return {
    name,
    color,
    emoji,
    initials
  };
}; 
