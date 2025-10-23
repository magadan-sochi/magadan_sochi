import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { WaiterDashboard } from './screens/dashboards/WaiterDashboard';
import { LearnScreen } from './screens/LearnScreen';
import { TestScreen } from './screens/TestScreen';
import { GameScreen } from './screens/GameScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminScreen } from './screens/AdminScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { api } from './services/mockApi';
import { LoginScreen } from './screens/LoginScreen';
import { GeneralManagerDashboard } from './screens/dashboards/GeneralManagerDashboard';
import { UserManagementScreen } from './screens/admin/UserManagementScreen';
import { QuizEditorScreen } from './screens/admin/QuizEditorScreen';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;
        
        if (!tg || !tg.initDataUnsafe?.user) {
          console.log("Running outside of Telegram or no user data. Displaying mock login screen.");
          setLoading(false);
          return;
        }

        tg.ready();
        
        const telegramUser = tg.initDataUnsafe.user;

        const user = await api.getCurrentUser(telegramUser.id);
        if (user) {
          setCurrentUser(user);
        } else {
          throw new Error(`Пользователь с Telegram ID ${telegramUser.id} не найден в системе. Обратитесь к администратору.`);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    authenticateUser();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-lg text-white">Аутентификация...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen p-4 text-center">
          <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg">
             <h2 className="text-xl font-bold text-red-300">Ошибка</h2>
             <p className="mt-2 text-red-200">{error}</p>
          </div>
        </div>
      );
    }
    
    if (!currentUser) {
       return <LoginScreen onLogin={setCurrentUser} />;
    }
    
    const managerRoles: UserRole[] = [
      UserRole.SUPER_ADMIN, 
      UserRole.GENERAL_MANAGER,
    ];
    const isManager = currentUser.roles.some(role => managerRoles.includes(role));

    switch (currentView) {
      case 'home':
        return isManager 
          ? <GeneralManagerDashboard user={currentUser} onNavigate={setCurrentView} />
          : <WaiterDashboard user={currentUser} onNavigate={setCurrentView} />;
      case 'learn':
        return <LearnScreen />;
      case 'test':
        return <TestScreen />;
      case 'game':
        return <GameScreen />;
      case 'profile':
        return <ProfileScreen user={currentUser} />;
      case 'admin':
        return <AdminScreen currentUser={currentUser} />;
      case 'userManagement':
        return <UserManagementScreen onNavigate={setCurrentView} />;
      case 'quizEditor':
        return <QuizEditorScreen onNavigate={setCurrentView} />;
      default:
        return isManager 
          ? <GeneralManagerDashboard user={currentUser} onNavigate={setCurrentView} />
          : <WaiterDashboard user={currentUser} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-y-auto text-white font-sans">
        <main className="container mx-auto max-w-lg">
            {renderContent()}
        </main>
        {currentUser && (
            <BottomNavBar activeView={currentView} onNavigate={setCurrentView} user={currentUser} />
        )}
    </div>
  );
};

export default App;