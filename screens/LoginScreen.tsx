

import React from 'react';
import { User, UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

// FIX: Corrected User object by replacing 'role' with 'roles' array and using valid UserRole enum values.
const mockUsers: User[] = [
    { id: '1', telegram_id: 101, full_name: 'Иван Петров', roles: [UserRole.WAITER], avatarUrl: 'https://picsum.photos/seed/ivan/100/100' },
    { id: '4', telegram_id: 104, full_name: 'Елена Васильева', roles: [UserRole.GENERAL_MANAGER], avatarUrl: 'https://picsum.photos/seed/elena/100/100' },
    { id: '5', telegram_id: 105, full_name: 'Дмитрий Козлов', roles: [UserRole.SUPER_ADMIN], avatarUrl: 'https://picsum.photos/seed/dmitry/100/100' },
    {
      id: '999',
      telegram_id: 999,
      full_name: 'Тестовый Администратор',
      roles: [
        UserRole.SUPER_ADMIN,
        UserRole.GENERAL_MANAGER,
        UserRole.CHEF,
        UserRole.BAR_MANAGER,
        UserRole.PASTRY_CHEF,
        UserRole.WAITER,
      ],
      avatarUrl: 'https://picsum.photos/seed/admin999/100/100'
    }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-2">Магадан Гейм</h1>
        <p className="text-cyan-300">Платформа обучения персонала</p>
      </div>
      <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-xl p-8 space-y-4">
        <h2 className="text-xl font-semibold text-center text-white">Войти как:</h2>
        {mockUsers.map(user => (
          <button
            key={user.id}
            onClick={() => onLogin(user)}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {/* FIX: Changed `user.role` to `user.roles.join(', ')` to correctly display the user's roles. */}
            {user.roles.join(', ')} ({user.full_name})
          </button>
        ))}
      </div>
    </div>
  );
};