import React from 'react';
import { User } from '../../types';

// SVG Icons for better styling
const LearnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.5h15M4.5 15.5h15" />
    </svg>
);
const TestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);
const GameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.55 5.55a5 5 0 010 7.07m-7.07 0a5 5 0 010-7.07m7.07 7.07l-1.414-1.414m-5.656 5.656l1.414-1.414m0 0l-1.414-1.414m5.656 5.656l-1.414-1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a.5.5 0 100-1 .5.5 0 000 1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.5a.5.5 0 100-1 .5.5 0 000 1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 12a.5.5 0 10-1 0 .5.5 0 001 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 12a.5.5 0 10-1 0 .5.5 0 001 0z" />
    </svg>
);
const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const ProgressBar: React.FC<{ title: string; percentage: number; gradient: string }> = ({ title, percentage, gradient }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <span className="text-gray-200 text-sm font-medium">{title}</span>
            <span className="font-bold text-white">{percentage}%</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${gradient}`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

interface WaiterDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const WaiterDashboard: React.FC<WaiterDashboardProps> = ({ user, onNavigate }) => {

  const menuOptions = [
    { view: 'learn', title: 'Учить', description: 'Изучайте меню с карточками', icon: <LearnIcon /> },
    { view: 'test', title: 'Тест', description: 'Проверьте свои знания', icon: <TestIcon /> },
    { view: 'game', title: 'Игры', description: 'Отработайте навыки в деле', icon: <GameIcon /> },
    { view: 'profile', title: 'Профиль', description: 'Ваш прогресс и достижения', icon: <ProfileIcon /> },
  ];

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center space-x-4 mb-8">
        <img src={user.avatarUrl} alt={user.full_name} className="w-16 h-16 rounded-full border-2 border-white/50 shadow-lg"/>
        <div>
          <h1 className="text-2xl font-bold text-white">Добро пожаловать,</h1>
          <h2 className="text-xl text-cyan-300 font-light">{user.full_name}!</h2>
        </div>
      </div>
      
      <p className="text-gray-300 mb-6 text-center text-lg">Готовы стать экспертом меню?</p>

      <div className="flex flex-col space-y-4">
        {menuOptions.map(option => (
          <div 
            key={option.view} 
            onClick={() => onNavigate(option.view)}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 flex items-center space-x-5 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.03] shadow-lg"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
                {option.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{option.title}</h3>
              <p className="text-gray-300 text-sm">{option.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-5">Ваш прогресс</h3>
        <div className="space-y-4">
            <ProgressBar title="Изучено меню" percentage={75} gradient="bg-gradient-to-r from-cyan-400 to-blue-500" />
            <ProgressBar title="Средний балл за тесты" percentage={92} gradient="bg-gradient-to-r from-lime-400 to-green-500" />
        </div>
      </div>
    </div>
  );
};