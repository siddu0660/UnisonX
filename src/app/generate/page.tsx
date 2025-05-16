'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

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

export default function Explore() {
  const [userInput, setUserInput] = useState('');
  const [letters, setLetters] = useState<LetterProps[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  const addLetter = (text: string) => {
    if (!text.trim()) return;
    
    let startY = 150;
    
    if (letters.length > 0) 
      {
      const maxY = Math.max(...letters.map(letter => letter.y));
      startY = maxY + 60;
    }
    
    const newLetters = text.split('').map((char, index) => ({
      id: `letter-${Date.now()}-${index}`,
      text: char,
      x: 100 + (index * 50),
      y: startY,
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
  
  // Handle two-finger scroll on the canvas
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Update canvas position based on wheel delta
    setCanvasPosition(prev => ({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <main className="container mx-auto px-4 py-16">
        <Link href="/" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Create with UnisonX
          </h1>
          
          <div className="flex flex-col space-y-6">
            {/* Input form */}
            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg mb-6">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Add Props to the Studio</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-400 mb-1">
                    Enter Text
                  </label>
                  <div className="flex space-x-3">
                    <input
                      id="text-input"
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Type your text here..."
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={!userInput.trim()}
                      className={`bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2
                        ${!userInput.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-lg'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add to Studio
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="text-gray-400">Quick Add:</span>
                  {["Hello", "Hi", "Music", "UnisonX", "♪ ♫ ♬"].map(text => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => {
                        setUserInput(text);
                        addLetter(text);
                      }}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Canvas area */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-300">Studio</h3>
                <div className="flex gap-2">
                  {letters.length > 0 && (
                    <button
                      onClick={() => {
                        setLetters([]);
                        setCanvasPosition({ x: 0, y: 0 });
                      }}
                      className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                      title="Clear all letters"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setCanvasPosition({ x: 0, y: 0 })}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                    title="Reset position"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset View
                  </button>
                </div>
              </div>
              
              <div 
                ref={canvasRef}
                className="relative w-full h-[400px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg"
                style={{
                  backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255, 255, 255, 0.03) 2px, transparent 0)',
                  backgroundSize: '20px 20px',
                  minWidth: '800px',
                  minHeight: '600px'
                }}
                onWheel={handleWheel}
              >
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
                    width: '100%',
                    height: '100%'
                  }}
                >
                {letters.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm">Add text to start creating</p>
                    </div>
                  </div>
                )}
                
                {letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="absolute transition-all duration-150 pointer-events-none"
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
              
              <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>{letters.length > 0 ? `Letters: ${letters.length}` : 'Use two-finger scroll to navigate the canvas'}</span>
                <span>{letters.length > 0 ? 'Letters are added to the studio' : 'Add text to start creating'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}