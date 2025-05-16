"use client";

import { useState, useRef } from "react";

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
  const [userInput, setUserInput] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add a new letter to the canvas
  const addLetter = (text: string) => {
    if (!text.trim()) return;
    const newLetters = text.split("").map((char, index) => ({
      id: `letter-${Date.now()}-${index}`,
      text: char,
      x: 100 + index * 50,
      y: 150,
      fontSize: 36,
      color: "#ffffff",
      fontFamily: "Arial",
      rotation: 0,
    }));

    setLetters((prev) => [...prev, ...newLetters]);
    setUserInput("");
  };

  // Update letter properties
  const updateLetter = (id: string, updates: Partial<LetterProps>) => {
    setLetters((prev) =>
      prev.map((letter) =>
        letter.id === id ? { ...letter, ...updates } : letter,
      ),
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
            className={`absolute cursor-move ${
              selectedLetter === letter.id 
                ? 'ring-2 ring-white z-10 scale-105 rounded-full p-2' 
                : 'hover:ring-1 hover:ring-white hover:scale-105 hover:rounded-full hover:p-2'
            }`}
            style={{
              left: `${letter.x}px`,
              top: `${letter.y}px`,
              fontSize: `${letter.fontSize}px`,
              color: letter.color,
              fontFamily: letter.fontFamily,
              transform: `rotate(${letter.rotation}deg)`,
              userSelect: "none",
              textShadow: selectedLetter === letter.id ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none',
            }}
            onClick={() => handleLetterClick(letter.id)}
            onMouseDown={(e) => {
              if (selectedLetter === letter.id) {
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
                    y: startLetterY + dy,
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }
            }}
          >
            {letter.text}
          </div>
        ))}
      </div>

      {/* Property controls */}
      {selectedLetter && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Letter Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Font Size</label>
              <input
                type="range"
                min="10"
                max="100"
                value={
                  letters.find((l) => l.id === selectedLetter)?.fontSize || 36
                }
                onChange={(e) =>
                  handlePropertyChange("fontSize", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Rotation</label>
              <input
                type="range"
                min="0"
                max="360"
                value={
                  letters.find((l) => l.id === selectedLetter)?.rotation || 0
                }
                onChange={(e) =>
                  handlePropertyChange("rotation", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Color</label>
              <input
                type="color"
                value={
                  letters.find((l) => l.id === selectedLetter)?.color ||
                  "#ffffff"
                }
                onChange={(e) => handlePropertyChange("color", e.target.value)}
                className="w-full h-10 rounded bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Font Family</label>
              <select
                value={
                  letters.find((l) => l.id === selectedLetter)?.fontFamily ||
                  "Arial"
                }
                onChange={(e) =>
                  handlePropertyChange("fontFamily", e.target.value)
                }
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
