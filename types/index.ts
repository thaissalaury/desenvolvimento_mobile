export interface Question {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answers: string[];
  correctAnswer: string;
}

export type Category = 
  | 'General Knowledge'
  | 'Science'
  | 'History'
  | 'Geography'
  | 'Technology'
  | 'Movies'
  | 'Music'
  | 'Sports';

export interface GameStats {
  highestScore: number;
  lastCategory: string | null;
  lastDifficulty: 'easy' | 'medium' | 'hard' | null;
  gamesPlayed: number;
  bestStreak: number;
}

export interface GameHistory {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  percentage: number;
}
