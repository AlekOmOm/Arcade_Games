import { useState } from 'react';
import { Joystick, Gamepad2, Trophy, Volume2 } from 'lucide-react';
import Snake from './games/Snake';

export default function Arcade() {
  const [currentGame, setCurrentGame] = useState('snake');
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-2">
            Retro Arcade
          </h1>
          <p className="text-purple-200">Relive the classics, one pixel at a time</p>
        </div>

        {/* Game Container */}
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden border-4 border-purple-500">
          {/* Game Header */}
          <div className="bg-purple-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Gamepad2 className="text-purple-200" size={24} />
              <h2 className="text-xl font-bold text-purple-100">Snake</h2>
            </div>
            <div className="flex items-center gap-4">
              <Trophy className="text-yellow-400" size={24} />
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-purple-200 hover:text-purple-100"
              >
                <Volume2 size={24} />
              </button>
            </div>
          </div>

          {/* Game Area */}
          <div className="p-4 bg-black">
            <Snake />
          </div>

          {/* Controls Info */}
          <div className="bg-purple-900 p-4">
            <div className="flex items-center justify-center gap-4 text-purple-200">
              <Joystick size={20} />
              <span>Use arrow keys to control the snake</span>
            </div>
          </div>
        </div>

        {/* Game Selection */}
        <div className="mt-8 flex justify-center gap-4">
          <GameButton
              active={currentGame === 'snake'}
              onClick={() => setCurrentGame('snake')}
              title="Snake"
              disabled={false}
          />
          <GameButton
              disabled
              onClick={() => {}}
              title="Space Invaders"
              active={false}
          />
          <GameButton
              disabled
              onClick={() => {
              }}
              title="Flappy Bird"
              active={false}
          />
        </div>
      </div>
    </div>
  );
}

function GameButton({ title, active, disabled, onClick }: {
  title: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-full font-semibold transition-all
        ${active 
          ? 'bg-purple-600 text-white shadow-lg scale-105' 
          : disabled 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
        }
      `}
    >
      {title}
      {disabled && ' (Coming Soon)'}
    </button>
  );
}