// FIX: Removed self-import of UserRole which was causing a circular dependency and declaration conflict.
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  GENERAL_MANAGER = 'general_manager',
  CHEF = 'chef',
  BAR_MANAGER = 'bar_manager',
  PASTRY_CHEF = 'pastry_chef',
  WAITER = 'waiter',
}

export interface User {
  id: string;
  telegram_id: number;
  full_name: string;
  roles: UserRole[];
  avatarUrl: string;
}

export interface MenuItemCategory {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  key_features: {
    ingredients?: string[];
    allergens?: string[];
  } | null;
  is_active: boolean;
}

export interface UserLearningProgress {
  user_id: string;
  menu_item_id: number;
  next_review_at: string;
  status: 'new' | 'learning' | 'learned';
}

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FIND_PHOTO = 'find_photo',
}

export interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
  is_trap?: boolean; // For gamification: a plausible but incorrect answer
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: QuestionType;
  answers: Answer[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: number;
  earned_at: string;
}

export interface LeaderboardEntry {
  user: {
      id: string;
      full_name: string;
      avatarUrl: string;
  };
  score: number;
  rank: number;
}

// Types for creating new quiz content
export type NewAnswer = Omit<Answer, 'id'>;
export type NewQuestion = Omit<Question, 'id' | 'quiz_id' | 'answers'> & { answers: NewAnswer[] };
export type NewQuiz = Omit<Quiz, 'id' | 'questions'> & { questions: NewQuestion[] };