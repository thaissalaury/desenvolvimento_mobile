import React, { createContext, useContext, useState, useEffect } from 'react';
import { Question, GameStats, GameHistory } from '../types';
import { StorageService } from '../services/storage';
import questionsData from '../data/questions.json';

// Estrutura do objeto de valores compartilhados pelo contexto do Quiz
interface QuizContextType {
  questions: Question[];                                      // Banco de dados completo de perguntas
  filteredQuestions: Question[];                              // Perguntas selecionadas para a partida atual
  selectedCategory: string | null;                            // Categoria selecionada pelo usuário
  selectedDifficulty: 'easy' | 'medium' | 'hard' | null;      // Dificuldade selecionada
  currentQuestionIndex: number;                               // Índice da pergunta ativa
  score: number;                                              // Pontuação de acertos na partida atual
  streak: number;                                             // Sequência de acertos seguidos ativa
  stats: GameStats;                                           // Estatísticas gerais acumuladas do usuário
  history: GameHistory[];                                     // Histórico geral de partidas
  isLoading: boolean;                                         // Estado de carregamento dos dados de persistência
  selectCategory: (category: string | null) => void;          // Define a categoria escolhida
  selectDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | null) => void; // Define a dificuldade
  startQuiz: () => void;                                      // Filtra, embaralha e inicia a partida do quiz
  answerQuestion: (isCorrect: boolean) => void;               // Registra o acerto ou erro da resposta do usuário
  nextQuestion: () => boolean;                                // Avança para a próxima pergunta (retorna se há uma próxima)
  finishQuiz: () => Promise<void>;                            // Finaliza o quiz, processa estatísticas e grava no storage
  resetQuiz: () => void;                                      // Reinicia estados temporários do quiz
  clearAllHistory: () => Promise<void>;                       // Exclui todos os históricos locais salvos e zera estatísticas
}

// Cria o contexto do React
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provedor do Contexto do Quiz (QuizProvider)
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado local para armazenar todas as perguntas carregadas do JSON local
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

  // Efeito disparado no carregamento inicial do aplicativo para recuperar dados offline
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const loadedStats = await StorageService.loadStats();
        const loadedHistory = await StorageService.loadHistory();
        setStats(loadedStats);
        setHistory(loadedHistory);

        // Preenche as últimas opções de jogo do usuário automaticamente se existirem
        if (loadedStats.lastCategory) {
          setSelectedCategory(loadedStats.lastCategory);
        }
        if (loadedStats.lastDifficulty) {
          setSelectedDifficulty(loadedStats.lastDifficulty);
        }
      } catch (error) {
        console.error('Failed to load storage data in Context:', error);
      } finally {
        setIsLoading(false); // Carregamento finalizado
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

  // Filtra, embaralha e define um subconjunto de no máximo 10 perguntas da categoria/dificuldade escolhida
  const startQuiz = () => {
    let filtered = questions;
    // Aplica o filtro de categoria se selecionado
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    // Aplica o filtro de dificuldade se selecionado
    if (selectedDifficulty) {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    // Embaralha aleatoriamente as perguntas filtradas
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    
    // Define a lista de perguntas final limitando a 10 itens e zera as pontuações e sequências da partida
    setFilteredQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
  };

  // Processa a resposta dada pelo usuário incrementando pontuações e sequências de acerto
  const answerQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0); // Zera sequência se errou
    }
  };

  // Avança para a próxima pergunta da pilha de filteredQuestions
  const nextQuestion = (): boolean => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return true; // Há perguntas restantes
    }
    return false; // Chegou ao fim do Quiz
  };

  // Finaliza a partida calculando novos recordes e salvando tudo localmente
  const finishQuiz = async () => {
    // Cria o objeto do novo registro de partida no histórico
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

    // Calcula os valores consolidados de estatísticas atualizados
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

    // Grava no armazenamento persistente de dados local
    await StorageService.saveStats(newStats);
    await StorageService.saveHistoryItem(historyItem);

    // Atualiza os estados reativos do React para refletir as mudanças na interface do usuário
    setStats(newStats);
    setHistory(prev => [historyItem, ...prev]);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
  };

  // Exclui completamente todos os históricos locais persistidos e estatísticas
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

// Hook customizado para consumir os estados globais do quiz de forma mais simples e intuitiva nas telas
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

