import React from 'react';
import { User } from '../../types';

const UserManagementIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const ContentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);
const QuizIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        <path d="M16.5 21a2.5 2.5 0 000-5 2.5 2.5 0 000 5z" />
        <path d="M7.5 9a2.5 2.5 0 000-5 2.5 2.5 0 000 5z" />
    </svg>
);
const AnalyticsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
);


interface GeneralManagerDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const GeneralManagerDashboard: React.FC<GeneralManagerDashboardProps> = ({ user, onNavigate }) => {

  const managementOptions = [
    { view: 'userManagement', title: 'Пользователи', description: 'Назначение ролей и управление', icon: <UserManagementIcon /> },
    { view: 'admin', title: 'Контент', description: 'Редактирование меню и категорий', icon: <ContentIcon /> },
    { view: 'quizEditor', title: 'Редактор тестов', description: 'Создание тестов и "ловушек"', icon: <QuizIcon /> },
    { view: 'analytics', title: 'Аналитика', description: 'Прогресс команды и отчеты', icon: <AnalyticsIcon />, disabled: true },
  ];

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center space-x-4 mb-8">
        <img src={user.avatarUrl} alt={user.full_name} className="w-16 h-16 rounded-full border-2 border-white/50 shadow-lg"/>
        <div>
          <h1 className="text-2xl font-bold text-white">Панель управления</h1>
          <h2 className="text-xl text-cyan-300 font-light">{user.full_name}</h2>
        </div>
      </div>
      
      <p className="text-gray-300 mb-6 text-center text-lg">Выберите раздел для управления</p>

      <div className="flex flex-col space-y-4">
        {managementOptions.map(option => (
          <div 
            key={option.view} 
            onClick={() => !option.disabled && onNavigate(option.view)}
            className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 flex items-center space-x-5 transition-all duration-300 shadow-lg ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/20 hover:border-white/30 transform hover:scale-[1.03]'}`}
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
    </div>
  );
};