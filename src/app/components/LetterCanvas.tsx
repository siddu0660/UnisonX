'use client';

import { useState, useRef } from 'react';

interface LetterProps {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
}

export default function LetterCanvas() {
  const [letters, setLetters] = useState<LetterProps[]>([]);
  const [userInput, setUserInput] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add a new letter to the canvas
  const addLetter = (text: string) => {
    if (!text.trim()) return;
    
    // Create a new letter for each character in the input
    const newLetters = text.split('').map((char, index) => ({
      id: `letter-${Date.now()}-${index}`,
      text: char,
      x: 100 + (index * 50), // Spread letters horizontally
      y: 150,
      fontSize: 36,
      color: '#ffffff',
      fontFamily: 'Arial',
      rotation: 0
    }));
    
    setLetters(prev => [...prev, ...newLetters]);
    setUserInput('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLetter(userInput);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter text to add to canvas..."
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
        >
          Add to Canvas
        </button>
      </form>

      {/* Canvas area */}
      <div 
        ref={canvasRef}
        className="relative w-full h-[400px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
      >
        {letters.map((letter) => (
          <div
            key={letter.id}
            className={"absolute cursor-move"}
            style={{
              left: `${letter.x}px`,
              top: `${letter.y}px`,
              fontSize: `${letter.fontSize}px`,
              color: letter.color,
              fontFamily: letter.fontFamily,
              transform: `rotate(${letter.rotation}deg)`,
              userSelect: 'none',
            }}
          >
            {letter.text}
          </div>
        ))}
      </div>
    </div>
  );
}