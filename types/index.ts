// Definição do formato do objeto de pergunta (Question) do quiz
export interface Question {
  id: string;                               // Identificador único da pergunta
  category: string;                         // Categoria temática (ex: 'Science')
  difficulty: 'easy' | 'medium' | 'hard';   // Níveis fixados de dificuldade
  question: string;                         // O enunciado/pergunta em si
  answers: string[];                        // Array de alternativas de resposta (estáticos)
  correctAnswer: string;                    // A string idêntica da resposta correta
}

// União de strings contendo todas as categorias disponíveis no QuizMaster
export type Category = 
  | 'General Knowledge'
  | 'Science'
  | 'History'
  | 'Geography'
  | 'Technology'
  | 'Movies'
  | 'Music'
  | 'Sports';

// Tipagem das estatísticas de jogo consolidadas que persistimos no SecureStore
export interface GameStats {
  highestScore: number;                               // Recorde pessoal de aproveitamento do usuário (%)
  lastCategory: string | null;                        // Última categoria jogada para pré-seleção rápida
  lastDifficulty: 'easy' | 'medium' | 'hard' | null;  // Última dificuldade jogada para pré-seleção rápida
  gamesPlayed: number;                                // Quantidade acumulada de partidas finalizadas
  bestStreak: number;                                 // Melhor sequência de acertos consecutivos
}

// Tipagem do item individual que compõe a lista de histórico de partidas salvas
export interface GameHistory {
  id: string;                               // Identificador aleatório único da partida no histórico
  date: string;                             // Data e hora em formato string amigável (pt-BR)
  score: number;                            // Pontuação final de acertos
  totalQuestions: number;                   // Número total de perguntas respondidas na partida
  category: string;                         // Nome da categoria jogada
  difficulty: 'easy' | 'medium' | 'hard';   // Dificuldade jogada
  percentage: number;                       // Porcentagem final de aproveitamento calculado
}

