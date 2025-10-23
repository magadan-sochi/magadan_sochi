import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../../services/mockApi';

interface UserManagementScreenProps {
    onNavigate: (view: string) => void;
}

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ onNavigate }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await api.getAllUsers();
                setUsers(usersData);
            } catch (err) {
                setError('Не удалось загрузить список пользователей.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);
    
    const handleRoleChange = async (userId: string, newRoles: UserRole[]) => {
        // Optimistic UI update
        const originalUsers = [...users];
        setUsers(users.map(u => u.id === userId ? { ...u, roles: newRoles } : u));
        
        const success = await api.updateUserRoles(userId, newRoles);
        
        if (!success) {
            // Revert on failure
            setUsers(originalUsers);
            alert('Не удалось обновить роль пользователя.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }
    
    if (error) {
        return <div className="p-4 text-center text-red-400">{error}</div>
    }

    return (
        <div className="p-4 pb-24">
            <div className="flex items-center mb-6">
                 <button onClick={() => onNavigate('home')} className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-3xl font-bold text-white">Управление пользователями</h1>
            </div>

            <div className="space-y-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={user.avatarUrl} alt={user.full_name} className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-bold text-white">{user.full_name}</p>
                                <p className="text-sm text-gray-400">ID: {user.telegram_id}</p>
                            </div>
                        </div>
                        <div>
                             <select 
                                value={user.roles[0] || ''} // Simple single role selection for now
                                onChange={(e) => handleRoleChange(user.id, [e.target.value as UserRole])}
                                className="bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2 text-sm"
                             >
                                {Object.values(UserRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};