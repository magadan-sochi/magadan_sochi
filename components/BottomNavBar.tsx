import React from 'react';
import { User, UserRole } from '../types';

interface BottomNavBarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  user: User | null;
}

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const LearnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
    </svg>
);

const TestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);


const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onNavigate, user }) => {
  const navItems = [
    { view: 'home', icon: <HomeIcon />, label: 'Главная' },
    { view: 'learn', icon: <LearnIcon />, label: 'Учить' },
    { view: 'test', icon: <TestIcon />, label: 'Тест' },
    { view: 'profile', icon: <ProfileIcon />, label: 'Профиль' },
  ];
  
  const adminRoles: UserRole[] = [
      UserRole.SUPER_ADMIN, 
      UserRole.GENERAL_MANAGER,
      UserRole.CHEF,
      UserRole.BAR_MANAGER,
      UserRole.PASTRY_CHEF,
  ];
  const isAdmin = user && user.roles.some(role => adminRoles.includes(role));

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-xl border-t border-white/10 flex justify-around">
      {navItems.map(item => (
        <button
          key={item.view}
          onClick={() => onNavigate(item.view)}
          className={`flex flex-col items-center justify-center pt-3 pb-2 w-full transition-colors duration-200 relative ${
            activeView === item.view ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
          }`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
          {activeView === item.view && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-cyan-300 rounded-b-full"></div>
          )}
        </button>
      ))}
      {isAdmin && (
        <button
          onClick={() => onNavigate('admin')}
          className={`flex flex-col items-center justify-center pt-3 pb-2 w-full transition-colors duration-200 relative ${
            activeView === 'admin' ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
          }`}
        >
          <AdminIcon />
          <span className="text-xs mt-1">Админ</span>
           {activeView === 'admin' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-cyan-300 rounded-b-full"></div>
          )}
        </button>
      )}
    </div>
  );
};
