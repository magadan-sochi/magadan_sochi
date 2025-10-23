import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { api } from '../services/mockApi';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const GameScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [options, setOptions] = useState<MenuItem[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getMenuItems().then(items => {
      setMenuItems(items);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (menuItems.length > 3) {
      generateNewQuestion();
    } else if (!isLoading) {
      setGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, isLoading]);

  const generateNewQuestion = () => {
    const availableItems = menuItems.filter(item => item.id !== currentItem?.id);
    if (availableItems.length < 4) {
      setGameOver(true);
      return;
    }
    
    const newCorrectItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    setCurrentItem(newCorrectItem);

    const otherItems = shuffleArray(availableItems.filter(i => i.id !== newCorrectItem.id)).slice(0, 3);
    const newOptions = shuffleArray([newCorrectItem, ...otherItems]);
    setOptions(newOptions);
  };

  const handleOptionClick = (selectedItem: MenuItem) => {
    if (feedback) return;

    if (selectedItem.id === currentItem?.id) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      generateNewQuestion();
    }, 1500);
  };

  if (isLoading) {
      return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
  }

  if (gameOver) {
    return (
      <div className="p-4 text-center h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-white mb-4">Игра окончена!</h1>
        <p className="text-xl text-cyan-400">Ваш счет: {score}</p>
        {menuItems.length < 4 && <p className="text-gray-400 mt-4">Недостаточно блюд в базе для игры.</p>}
      </div>
    );
  }

  if (!currentItem || options.length === 0) {
    return <div className="p-4 text-center">Генерация вопроса...</div>;
  }
  
  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Игра "Найди фото"</h1>
      <p className="text-center text-cyan-400 mb-6 font-semibold">Счет: {score}</p>
      
      <div className="bg-gray-800 p-6 rounded-lg text-center mb-6">
        <p className="text-gray-300 text-lg">Найдите фото для блюда:</p>
        <h2 className="text-2xl font-bold text-white mt-1">{currentItem.name}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map(option => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option)}
            className={`
              rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105
              ${feedback && (option.id === currentItem.id ? 'border-4 border-green-500' : '')}
              ${feedback === 'incorrect' && (option.id !== currentItem.id ? 'opacity-50' : '')}
            `}
          >
            <img src={option.image_url} alt="option" className="w-full h-32 object-cover" />
          </div>
        ))}
      </div>
      
      {feedback === 'correct' && (
        <div className="mt-6 text-center text-2xl font-bold text-green-500">
          Верно! +10 очков
        </div>
      )}
      {feedback === 'incorrect' && (
        <div className="mt-6 text-center text-2xl font-bold text-red-500">
          Ошибка!
        </div>
      )}
    </div>
  );
};