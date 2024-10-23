import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function Snake() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    generateFood();
    setIsPaused(false);
  };

  const checkCollision = useCallback((head) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }

    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (checkCollision(head)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, checkCollision, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ') {
        setIsPaused((prev) => !prev);
        return;
      }

      if (gameOver) {
        resetGame();
        return;
      }

      const keyMap = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (keyMap[e.key]) {
        const newDirection = keyMap[e.key];
        const opposites = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
        };

        if (opposites[newDirection] !== direction) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake]);

  return (
    <div className="relative">
      <div 
        className="grid gap-0 bg-gray-900 border-2 border-purple-500"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          width: GRID_SIZE * CELL_SIZE + 'px',
          height: GRID_SIZE * CELL_SIZE + 'px',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          
          return (
            <div
              key={index}
              className={`
                ${isSnake ? 'bg-green-500' : ''}
                ${isFood ? 'bg-red-500' : ''}
              `}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            />
          );
        })}
      </div>

      {/* Score Display */}
      <div className="absolute top-2 right-2 bg-purple-900 px-3 py-1 rounded-full">
        <span className="text-purple-200">Score: {score}</span>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-2">Game Over!</h3>
            <p className="text-purple-200 mb-4">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-2">Paused</h3>
            <p className="text-purple-200">Press Space to Resume</p>
          </div>
        </div>
      )}
    </div>
  );
}