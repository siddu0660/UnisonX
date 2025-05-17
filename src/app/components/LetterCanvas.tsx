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

interface BallProps {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

type ElementType = "letter" | "ball";

export default function LetterCanvas() {
  const [letters, setLetters] = useState<LetterProps[]>([]);
  const [balls, setBalls] = useState<BallProps[]>([]);
  
  const [userInput, setUserInput] = useState("");
  const [selectedElement, setSelectedElement] = useState<{id: string, type: ElementType} | null>(null);
  
  // UI state for adding new elements
  const [ballSize, setBallSize] = useState(30);
  const [ballColor, setBallColor] = useState("#ff5500");
  
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

  // Add a new ball to the canvas
  const addBall = () => {
    const newBall = {
      id: `ball-${Date.now()}`,
      x: Math.random() * (canvasRef.current?.clientWidth || 400 - ballSize),
      y: Math.random() * (canvasRef.current?.clientHeight || 400 - ballSize),
      size: ballSize,
      color: ballColor,
    };
    setBalls((prev) => [...prev, newBall]);
  };

  // Update letter properties
  const updateLetter = (id: string, updates: Partial<LetterProps>) => {
    setLetters((prev) =>
      prev.map((letter) =>
        letter.id === id ? { ...letter, ...updates } : letter,
      ),
    );
  };

  // Update ball properties
  const updateBall = (id: string, updates: Partial<BallProps>) => {
    setBalls((prev) =>
      prev.map((ball) =>
        ball.id === id ? { ...ball, ...updates } : ball,
      ),
    );
  };

  // Handle element selection
  const handleElementClick = (id: string, type: ElementType) => {
    setSelectedElement({ id, type });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLetter(userInput);
  };

  // Handle property changes for selected element
  const handlePropertyChange = (property: string, value: string | number) => {
    if (!selectedElement) return;

    const { id, type } = selectedElement;

    if (type === "letter") {
      const updates = { [property]: value } as Partial<LetterProps>;
      updateLetter(id, updates);
    } else if (type === "ball") {
      const updates = { [property]: value } as Partial<BallProps>;
      updateBall(id, updates);
    }
  };

  // Generic drag handler for any element
  const handleDragStart = (e: React.MouseEvent, id: string, type: ElementType, startX: number, startY: number) => {
    let startElementX = 0;
    let startElementY = 0;

    if (type === "letter") {
      const element = letters.find(l => l.id === id);
      if (element) {
        startElementX = element.x;
        startElementY = element.y;
      }
    } else if (type === "ball") {
      const element = balls.find(b => b.id === id);
      if (element) {
        startElementX = element.x;
        startElementY = element.y;
      }
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - e.clientX;
      const dy = moveEvent.clientY - e.clientY;
      
      if (type === "letter") {
        updateLetter(id, {
          x: startElementX + dx,
          y: startElementY + dy,
        });
      } else if (type === "ball") {
        updateBall(id, {
          x: startElementX + dx,
          y: startElementY + dy,
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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

      {/* Ball controls */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Add Ball</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm mb-1">Size</label>
            <input
              type="range"
              min="10"
              max="100"
              value={ballSize}
              onChange={(e) => setBallSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Color</label>
            <input
              type="color"
              value={ballColor}
              onChange={(e) => setBallColor(e.target.value)}
              className="w-full h-8 rounded bg-transparent"
            />
          </div>
          <button
            onClick={addBall}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Ball
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        className="relative w-full h-[400px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
        onClick={(e) => {
          // Deselect when clicking on empty canvas area
          if (e.target === canvasRef.current) {
            setSelectedElement(null);
          }
        }}
      >
        {/* Letters */}
        {letters.map((letter) => (
          <div
            key={letter.id}
            className={`absolute cursor-move ${
              selectedElement?.id === letter.id && selectedElement?.type === "letter"
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
              textShadow: selectedElement?.id === letter.id && selectedElement?.type === "letter" 
                ? '0 0 8px rgba(255, 255, 255, 0.5)' 
                : 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(letter.id, "letter");
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (selectedElement?.id === letter.id && selectedElement?.type === "letter") {
                handleDragStart(e, letter.id, "letter", e.clientX, e.clientY);
              } else {
                handleElementClick(letter.id, "letter");
              }
            }}
          >
            {letter.text}
          </div>
        ))}

        {/* Balls */}
        {balls.map((ball) => (
          <div
            key={ball.id}
            className={`absolute cursor-move rounded-full ${
              selectedElement?.id === ball.id && selectedElement?.type === "ball"
                ? 'ring-2 ring-white z-10' 
                : 'hover:ring-1 hover:ring-white'
            }`}
            style={{
              left: `${ball.x}px`,
              top: `${ball.y}px`,
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              backgroundColor: ball.color,
              boxShadow: selectedElement?.id === ball.id && selectedElement?.type === "ball" 
                ? '0 0 8px rgba(255, 255, 255, 0.5)' 
                : 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(ball.id, "ball");
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (selectedElement?.id === ball.id && selectedElement?.type === "ball") {
                handleDragStart(e, ball.id, "ball", e.clientX, e.clientY);
              } else {
                handleElementClick(ball.id, "ball");
              }
            }}
          />
        ))}
      </div>

      {/* Property controls for selected element */}
      {selectedElement && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">
            {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {selectedElement.type === "letter" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Font Size</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={
                      letters.find((l) => l.id === selectedElement.id)?.fontSize || 36
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
                      letters.find((l) => l.id === selectedElement.id)?.rotation || 0
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
                      letters.find((l) => l.id === selectedElement.id)?.color ||
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
                      letters.find((l) => l.id === selectedElement.id)?.fontFamily ||
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
              </>
            )}

            {selectedElement.type === "ball" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Size</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={
                      balls.find((b) => b.id === selectedElement.id)?.size || 30
                    }
                    onChange={(e) =>
                      handlePropertyChange("size", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Color</label>
                  <input
                    type="color"
                    value={
                      balls.find((b) => b.id === selectedElement.id)?.color ||
                      "#ff5500"
                    }
                    onChange={(e) => handlePropertyChange("color", e.target.value)}
                    className="w-full h-10 rounded bg-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}