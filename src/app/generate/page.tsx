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
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  // Add a new letter to the canvas
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

  // Update letter properties
  const updateLetter = (id: string, updates: Partial<LetterProps>) => {
    setLetters(prev => 
      prev.map(letter => 
        letter.id === id ? { ...letter, ...updates } : letter
      )
    );
  };

  // Handle letter selection
  const handleLetterClick = (id: string) => {
    setSelectedLetter(id);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLetter(userInput);
  };

  // Handle property changes for selected letter
  const handlePropertyChange = (property: string, value: string | number) => {
    if (!selectedLetter) return;
    
    const updates = {
      [property]: value
    } as Partial<LetterProps>;
    
    updateLetter(selectedLetter, updates);
  };

  // Delete selected letter
  const deleteLetter = () => {
    if (!selectedLetter) return;
    
    setLetters(prev => prev.filter(letter => letter.id !== selectedLetter));
    setSelectedLetter(null);
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
                    className={`absolute cursor-move transition-all duration-150 ${
                      selectedLetter === letter.id 
                        ? 'ring-2 ring-white z-10 scale-105 rounded-full p-2' 
                        : 'hover:ring-1 hover:ring-white hover:rounded-full hover:p-2'
                    }`}
                    style={{
                      left: `${letter.x}px`,
                      top: `${letter.y}px`,
                      fontSize: `${letter.fontSize}px`,
                      color: letter.color,
                      fontFamily: letter.fontFamily,
                      transform: `rotate(${letter.rotation}deg)`,
                      userSelect: 'none',
                      textShadow: selectedLetter === letter.id ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none',
                    }}
                    onClick={() => handleLetterClick(letter.id)}
                    onMouseDown={(e) => {
                      handleLetterClick(letter.id);
                      // Handle dragging logic here
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const startLetterX = letter.x;
                      const startLetterY = letter.y;
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const dx = moveEvent.clientX - startX;
                        const dy = moveEvent.clientY - startY;
                        updateLetter(letter.id, {
                          x: startLetterX + dx,
                          y: startLetterY + dy
                        });
                      };
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    {letter.text}
                    {selectedLetter === letter.id && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap">
                        Click & drag to move
                      </div>
                    )}
                  </div>
                ))}
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>{letters.length > 0 ? `Letters: ${letters.length}` : 'Use two-finger scroll to navigate the canvas'}</span>
                <span>{letters.length > 0 ? 'Click on a letter to edit its properties' : 'Add text to start creating'}</span>
              </div>
            </div>

            {/* Property controls */}
            {selectedLetter && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-10"></div>
                
                {/* Header with selected letter preview */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-4 rounded-lg shadow-lg">
                      <span className="text-2xl font-bold" >
                        {letters.find(l => l.id === selectedLetter)?.text || ""}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Letter Properties
                      </h3>
                      <p className="text-xs text-gray-400">Customize appearance and style</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedLetter(null)}
                      className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
                      title="Close editor"
                    >
                      Done
                    </button>
                    <button
                      onClick={deleteLetter}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg flex items-center gap-1"
                      title="Delete this letter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Quick style presets - redesigned as cards */}
                <div className="mb-8 relative z-10">
                  <label className="block text-sm font-medium mb-3 text-purple-300">Quick Styles</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button 
                      onClick={() => {
                        if (!selectedLetter) return;
                        updateLetter(selectedLetter, { 
                          fontSize: 48, 
                          color: '#FF5E5E', 
                          rotation: 0,
                          fontFamily: 'Arial'
                        });
                      }}
                      className="p-3 bg-gradient-to-br from-red-500 to-red-700 bg-opacity-30 rounded-lg hover:shadow-lg transition-all flex flex-col items-center justify-center h-20"
                      title="Bold red style"
                    >
                      <span className="text-2xl font-bold text-red-400">A</span>
                      <span className="text-xs mt-1 text-gray-300">Bold Red</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (!selectedLetter) return;
                        updateLetter(selectedLetter, { 
                          fontSize: 36, 
                          color: '#5E9FFF', 
                          rotation: -10,
                          fontFamily: 'Georgia'
                        });
                      }}
                      className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 bg-opacity-30 rounded-lg hover:shadow-lg transition-all flex flex-col items-center justify-center h-20"
                      title="Stylish blue"
                    >
                      <span className="text-2xl italic text-blue-400" style={{transform: 'rotate(-10deg)', display: 'inline-block'}}>A</span>
                      <span className="text-xs mt-1 text-gray-300">Stylish Blue</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (!selectedLetter) return;
                        updateLetter(selectedLetter, { 
                          fontSize: 42, 
                          color: '#FFDB5E', 
                          rotation: 10,
                          fontFamily: 'Verdana'
                        });
                      }}
                      className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-700 bg-opacity-30 rounded-lg hover:shadow-lg transition-all flex flex-col items-center justify-center h-20"
                      title="Playful yellow"
                    >
                      <span className="text-2xl font-bold text-yellow-300" style={{transform: 'rotate(10deg)', display: 'inline-block'}}>A</span>
                      <span className="text-xs mt-1 text-gray-300">Playful Yellow</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (!selectedLetter) return;
                        updateLetter(selectedLetter, { 
                          fontSize: 32, 
                          color: '#5EFF8F', 
                          rotation: 0,
                          fontFamily: 'Courier New'
                        });
                      }}
                      className="p-3 bg-gradient-to-br from-green-500 to-green-700 bg-opacity-30 rounded-lg hover:shadow-lg transition-all flex flex-col items-center justify-center h-20"
                      title="Tech green"
                    >
                      <span className="text-2xl font-mono text-green-400">A</span>
                      <span className="text-xs mt-1 text-gray-300">Tech Green</span>
                    </button>
                  </div>
                </div>

                {/* Controls in tabs */}
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-sm font-medium text-purple-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Font Size
                        </label>
                        <span className="text-sm bg-gray-700 px-2 py-1 rounded-md text-purple-300 font-mono">
                          {letters.find(l => l.id === selectedLetter)?.fontSize || 36}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={letters.find(l => l.id === selectedLetter)?.fontSize || 36}
                        onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        title="Adjust font size"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>10px</span>
                        <span>100px</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-sm font-medium text-purple-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Rotation
                        </label>
                        <span className="text-sm bg-gray-700 px-2 py-1 rounded-md text-purple-300 font-mono">
                          {letters.find(l => l.id === selectedLetter)?.rotation || 0}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={letters.find(l => l.id === selectedLetter)?.rotation || 0}
                        onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        title="Adjust rotation"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>0°</span>
                        <span>360°</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-purple-300 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={letters.find(l => l.id === selectedLetter)?.color || '#ffffff'}
                          onChange={(e) => handlePropertyChange('color', e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0 shadow-lg"
                          title="Choose color"
                        />
                        <div className="grid grid-cols-6 gap-2">
                          {['#ffffff', '#FF5E5E', '#5E9FFF', '#FFDB5E', '#5EFF8F', '#D15EFF'].map(color => (
                            <button
                              key={color}
                              onClick={() => handlePropertyChange('color', color)}
                              className={`w-8 h-8 rounded-full hover:scale-110 transition-transform shadow-md ${
                                letters.find(l => l.id === selectedLetter)?.color === color ? 'ring-2 ring-white' : 'ring-1 ring-gray-600'
                              }`}
                              style={{ backgroundColor: color }}
                              title={`Set color to ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-purple-300 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        Font Family
                      </label>
                      <select
                        value={letters.find(l => l.id === selectedLetter)?.fontFamily || 'Arial'}
                        onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none shadow-md"
                        title="Select font family"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Trebuchet MS">Trebuchet MS</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click and drag the letter on the canvas to reposition it
                  </p>
                  <button 
                    onClick={() => {
                      if (!selectedLetter) return;
                      updateLetter(selectedLetter, { 
                        fontSize: 36, 
                        color: '#ffffff', 
                        rotation: 0,
                        fontFamily: 'Arial'
                      });
                    }}
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}