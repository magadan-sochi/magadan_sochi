import { createClient } from '@supabase/supabase-js';
import { User, UserRole, MenuItem, MenuItemCategory, Quiz, LeaderboardEntry, Achievement, UserAchievement, NewQuiz } from '../types';

const supabaseUrl = 'https://fznwowvfkskxzqwxsorm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bndvd3Zma3NreHpxd3hzb3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDgyNjQsImV4cCI6MjA3NjY4NDI2NH0.YKhDwZAsCGFrIJYcYXkym9b8NgLlSq7hPUo6x4kPi9E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type NewMenuItem = Omit<MenuItem, 'id'>;
export type NewCategory = Omit<MenuItemCategory, 'id'>;

// Helper function to normalize naming conventions
const capitalizeName = (name: string): string => {
  if (!name) return '';
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};


export const api = {
  getCurrentUser: async (telegramId: number): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        telegram_id,
        full_name,
        user_roles (
          roles ( name )
        )
      `)
      .eq('telegram_id', telegramId)
      .single();

    if (error || !data) {
      console.error('Error fetching user:', error?.message);
      return null;
    }
    
    const user: User = {
        id: data.id,
        telegram_id: data.telegram_id,
        full_name: data.full_name,
        avatarUrl: `https://picsum.photos/seed/${data.id}/100/100`, // Placeholder avatar
        roles: data.user_roles.map((ur: any) => ur.roles.name as UserRole),
    };
    return user;
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        telegram_id,
        full_name,
        user_roles ( roles ( name ) )
      `);

    if (error) {
      console.error('Error fetching all users:', error.message);
      return [];
    }

    return data.map((d: any) => ({
      id: d.id,
      telegram_id: d.telegram_id,
      full_name: d.full_name,
      avatarUrl: `https://picsum.photos/seed/${d.id}/100/100`,
      roles: d.user_roles.map((ur: any) => ur.roles.name as UserRole),
    }));
  },

  updateUserRoles: async (userId: string, newRoles: UserRole[]): Promise<boolean> => {
      // This is a mock implementation.
      // In a real scenario, you would call Supabase RPC or handle relations.
      console.log(`MOCK: Updating user ${userId} roles to:`, newRoles);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate success
      return true;
  },

  // FIX: Converted .then() to async/await to ensure a true Promise is returned, resolving the PromiseLike type error.
  getMenuItems: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase.from('menu_items').select('*').eq('is_active', true);
    if (error) {
        console.error('Error fetching menu items:', error.message);
        return [];
    }
    return data || [];
  },
  
  // FIX: Converted .then() to async/await to ensure a true Promise is returned, resolving the PromiseLike type error.
  getMenuItem: async (id: number): Promise<MenuItem | undefined> => {
    const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') { // PGRST116: exact one row not found
      console.error(`Error fetching menu item ${id}:`, error.message);
    }
    return data ?? undefined;
  },

  addMenuItem: async (itemData: NewMenuItem): Promise<MenuItem | null> => {
    const normalizedItem = {
        ...itemData,
        name: capitalizeName(itemData.name),
    };
    const { data, error } = await supabase
      .from('menu_items')
      .insert(normalizedItem)
      .select()
      .single();

    if (error) {
        console.error('Error adding menu item:', error.message);
        return null;
    }
    return data;
  },
  
  addCategory: async (categoryData: NewCategory): Promise<MenuItemCategory | null> => {
    const normalizedCategory = {
        ...categoryData,
        name: capitalizeName(categoryData.name),
    };
    const { data, error } = await supabase
      .from('menu_categories')
      .insert(normalizedCategory)
      .select()
      .single();

    if (error) {
        console.error('Error adding category:', error.message);
        return null;
    }
    return data;
  },

  // FIX: Converted .then() to async/await to ensure a true Promise is returned, resolving the PromiseLike type error.
  getCategories: async (): Promise<MenuItemCategory[]> => {
    const { data, error } = await supabase.from('menu_categories').select('*');
    if (error) {
        console.error('Error fetching categories:', error.message);
        return [];
    }
    return data || [];
  },
  
  getQuizzes: async (): Promise<Quiz[]> => {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions (
          *,
          answers (*)
        )
      `);
    if (error) {
        console.error('Error fetching quizzes:', error);
        return [];
    }
    return data || [];
  },

  createQuiz: async (quizData: NewQuiz): Promise<Quiz | null> => {
    // This is a mock implementation.
    console.log("MOCK: Creating new quiz:", quizData);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return a mock quiz object
    const newQuiz: Quiz = {
        id: Math.floor(Math.random() * 1000),
        title: quizData.title,
        questions: quizData.questions.map((q, i) => ({
            ...q,
            id: i + 1,
            quiz_id: 100,
            answers: q.answers.map((a, j) => ({ ...a, id: j + 1 })),
        })),
    };
    return newQuiz;
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const { data: users, error } = await supabase.from('users').select('id, full_name').limit(3);
    if(error || !users) return [];
    
    const mockLeaderboard: LeaderboardEntry[] = [
        { user: { id: users[0]?.id || '1', full_name: users[0]?.full_name || 'Иван Петров', avatarUrl: `https://picsum.photos/seed/${users[0]?.id}/100/100`}, score: 1250, rank: 1 },
        { user: { id: users[1]?.id || '2', full_name: users[1]?.full_name || 'Мария Сидорова', avatarUrl: `https://picsum.photos/seed/${users[1]?.id}/100/100`}, score: 1100, rank: 2 },
        { user: { id: users[2]?.id || '3', full_name: users[2]?.full_name || 'Алексей Иванов', avatarUrl: `https://picsum.photos/seed/${users[2]?.id}/100/100`}, score: 980, rank: 3 },
    ];
    return mockLeaderboard;
  },

  // FIX: Converted .then() to async/await to ensure a true Promise is returned, resolving the PromiseLike type error.
  getAchievements: async (): Promise<Achievement[]> => {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error) {
        console.error('Error fetching achievements:', error.message);
        return [];
    }
    return data || [];
  },
  
  // FIX: Converted .then() to async/await to ensure a true Promise is returned, resolving the PromiseLike type error.
  getUserAchievements: async (userId: string): Promise<UserAchievement[]> => {
    const { data, error } = await supabase.from('user_achievements').select('*').eq('user_id', userId);
    if (error) {
        console.error(`Error fetching user achievements for ${userId}:`, error.message);
        return [];
    }
    return data || [];
  },
};
