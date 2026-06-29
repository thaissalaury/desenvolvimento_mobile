import React, { createContext, useContext, useState, useEffect } from 'react';
import { Question, GameStats, GameHistory } from '../types';
import { StorageService } from '../services/storage';
import questionsData from '../data/questions.json';

interface QuizContextType {
  questions: Question[];
  filteredQuestions: Question[];
  selectedCategory: string | null;
  selectedDifficulty: 'easy' | 'medium' | 'hard' | null;
  currentQuestionIndex: number;
  score: number;
  streak: number;
  stats: GameStats;
  history: GameHistory[];
  isLoading: boolean;
  selectCategory: (category: string | null) => void;
  selectDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | null) => void;
  startQuiz: () => void;
  answerQuestion: (isCorrect: boolean) => void;
  nextQuestion: () => boolean; // returns true if there is a next question, false if end of quiz
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
  clearAllHistory: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions] = useState<Question[]>(questionsData as Question[]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [stats, setStats] = useState<GameStats>({
    highestScore: 0,
    lastCategory: null,
    lastDifficulty: null,
    gamesPlayed: 0,
    bestStreak: 0,
  });
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load storage data on mount
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const loadedStats = await StorageService.loadStats();
        const loadedHistory = await StorageService.loadHistory();
        setStats(loadedStats);
        setHistory(loadedHistory);

        // Pre-populate last selections if they exist
        if (loadedStats.lastCategory) {
          setSelectedCategory(loadedStats.lastCategory);
        }
        if (loadedStats.lastDifficulty) {
          setSelectedDifficulty(loadedStats.lastDifficulty);
        }
      } catch (error) {
        console.error('Failed to load storage data in Context:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const selectCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  const selectDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | null) => {
    setSelectedDifficulty(difficulty);
  };

  // Filter and shuffle questions for the quiz (limit to 10 questions)
  const startQuiz = () => {
    let filtered = questions;
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    // Shuffle implementation
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    // Take a maximum of 10 questions per quiz
    setFilteredQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
  };

  const answerQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = (): boolean => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return true;
    }
    return false;
  };

  const finishQuiz = async () => {
    // Generate new game history item
    const historyItem: GameHistory = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score,
      totalQuestions: filteredQuestions.length,
      category: selectedCategory || 'Geral',
      difficulty: selectedDifficulty || 'medium',
      percentage: Math.round((score / (filteredQuestions.length || 1)) * 100),
    };

    // Calculate new stats
    const newGamesPlayed = stats.gamesPlayed + 1;
    const newHighestScore = Math.max(stats.highestScore, historyItem.percentage);
    const newBestStreak = Math.max(stats.bestStreak, streak);

    const newStats: GameStats = {
      highestScore: newHighestScore,
      lastCategory: selectedCategory,
      lastDifficulty: selectedDifficulty,
      gamesPlayed: newGamesPlayed,
      bestStreak: newBestStreak,
    };

    // Save to storage
    await StorageService.saveStats(newStats);
    await StorageService.saveHistoryItem(historyItem);

    // Update state
    setStats(newStats);
    setHistory(prev => [historyItem, ...prev]);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
  };

  const clearAllHistory = async () => {
    await StorageService.clearHistory();
    setHistory([]);
    const resetStats: GameStats = {
      highestScore: 0,
      lastCategory: null,
      lastDifficulty: null,
      gamesPlayed: 0,
      bestStreak: 0,
    };
    await StorageService.saveStats(resetStats);
    setStats(resetStats);
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        filteredQuestions,
        selectedCategory,
        selectedDifficulty,
        currentQuestionIndex,
        score,
        streak,
        stats,
        history,
        isLoading,
        selectCategory,
        selectDifficulty,
        startQuiz,
        answerQuestion,
        nextQuestion,
        finishQuiz,
        resetQuiz,
        clearAllHistory,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
