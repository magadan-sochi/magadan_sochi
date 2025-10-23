import React, { useState, useEffect } from 'react';
import { User, Achievement, LeaderboardEntry, UserAchievement } from '../types';
import { api } from '../services/mockApi';

interface ProfileScreenProps {
  user: User;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user }) => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [achievementsData, userAchievementsData, leaderboardData] = await Promise.all([
                api.getAchievements(),
                api.getUserAchievements(user.id),
                api.getLeaderboard()
            ]);
            setAchievements(achievementsData);
            setUserAchievements(userAchievementsData);
            setLeaderboard(leaderboardData);
            setIsLoading(false);
        };
        fetchData();
    }, [user.id]);

    const userAchievementIds = userAchievements.map(ua => ua.achievement_id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 pb-20">
            <div className="flex flex-col items-center mb-8">
                <img src={user.avatarUrl} alt={user.full_name} className="w-24 h-24 rounded-full border-4 border-cyan-400 mb-4" />
                <h1 className="text-2xl font-bold text-white">{user.full_name}</h1>
                <p className="text-gray-400">{user.roles.join(', ')}</p>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Достижения</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                    {achievements.map(ach => (
                        <div key={ach.id} className={`p-2 rounded-md ${userAchievementIds.includes(ach.id) ? 'bg-gray-700' : 'opacity-40'}`} title={ach.name}>
                            <div className="text-3xl">{ach.icon_url || '🏆'}</div>
                            <p className="text-xs mt-1 text-gray-300 truncate">{ach.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Доска почета</h2>
                <div className="space-y-3">
                    {leaderboard.map(({ user: player, score, rank }) => (
                        <div key={player.id} className={`flex items-center p-3 rounded-md ${player.id === user.id ? 'bg-cyan-600/20 border border-cyan-500' : 'bg-gray-700'}`}>
                            <span className="font-bold text-lg w-8">{rank}</span>
                            <img src={player.avatarUrl} alt={player.full_name} className="w-10 h-10 rounded-full mx-3" />
                            <span className="flex-grow text-white truncate">{player.full_name}</span>
                            <span className="font-bold text-cyan-400">{score}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};