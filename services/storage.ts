import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import { GameStats, GameHistory } from '../types';

// Caminho absoluto no dispositivo para salvar o arquivo JSON do histórico de partidas
const HISTORY_FILE_PATH = `${FileSystem.documentDirectory}history.json`;

// Chaves exclusivas para gravação e leitura no SecureStore (armazenamento seguro encriptado)
const STATS_KEYS = {
  highestScore: 'quizmaster_highest_score',
  lastCategory: 'quizmaster_last_category',
  lastDifficulty: 'quizmaster_last_difficulty',
  gamesPlayed: 'quizmaster_games_played',
  bestStreak: 'quizmaster_best_streak',
};

// Serviço central de persistência de dados local (armazenamento offline)
export const StorageService = {
  // --- SecureStore: Estatísticas do Usuário (Encriptado e seguro) ---
  
  // Salva ou atualiza os recordes e estatísticas gerais
  async saveStats(stats: GameStats): Promise<void> {
    try {
      await SecureStore.setItemAsync(STATS_KEYS.highestScore, String(stats.highestScore));
      
      // Salva ou remove a última categoria jogada dependendo do valor
      if (stats.lastCategory) {
        await SecureStore.setItemAsync(STATS_KEYS.lastCategory, stats.lastCategory);
      } else {
        await SecureStore.deleteItemAsync(STATS_KEYS.lastCategory);
      }
      
      // Salva ou remove a última dificuldade jogada dependendo do valor
      if (stats.lastDifficulty) {
        await SecureStore.setItemAsync(STATS_KEYS.lastDifficulty, stats.lastDifficulty);
      } else {
        await SecureStore.deleteItemAsync(STATS_KEYS.lastDifficulty);
      }
      
      await SecureStore.setItemAsync(STATS_KEYS.gamesPlayed, String(stats.gamesPlayed));
      await SecureStore.setItemAsync(STATS_KEYS.bestStreak, String(stats.bestStreak));
    } catch (error) {
      console.error('Error saving stats to SecureStore:', error);
    }
  },

  // Lê as estatísticas salvas anteriormente. Caso não existam, retorna valores padrão zerados
  async loadStats(): Promise<GameStats> {
    try {
      const highestScoreStr = await SecureStore.getItemAsync(STATS_KEYS.highestScore);
      const lastCategory = await SecureStore.getItemAsync(STATS_KEYS.lastCategory);
      const lastDifficulty = await SecureStore.getItemAsync(STATS_KEYS.lastDifficulty) as any;
      const gamesPlayedStr = await SecureStore.getItemAsync(STATS_KEYS.gamesPlayed);
      const bestStreakStr = await SecureStore.getItemAsync(STATS_KEYS.bestStreak);

      return {
        highestScore: highestScoreStr ? parseInt(highestScoreStr, 10) : 0,
        lastCategory: lastCategory || null,
        lastDifficulty: lastDifficulty || null,
        gamesPlayed: gamesPlayedStr ? parseInt(gamesPlayedStr, 10) : 0,
        bestStreak: bestStreakStr ? parseInt(bestStreakStr, 10) : 0,
      };
    } catch (error) {
      console.error('Error loading stats from SecureStore:', error);
      return {
        highestScore: 0,
        lastCategory: null,
        lastDifficulty: null,
        gamesPlayed: 0,
        bestStreak: 0,
      };
    }
  },

  // --- FileSystem: Histórico Completo de Partidas (Escrita e leitura em arquivos de texto no disco) ---
  
  // Salva uma nova partida no início da lista do histórico local
  async saveHistoryItem(item: GameHistory): Promise<void> {
    try {
      const history = await this.loadHistory();
      history.unshift(item); // Adiciona o jogo recente no início da fila
      
      // Escreve a string JSON codificada em UTF-8 diretamente no sistema de arquivos do aparelho
      await FileSystem.writeAsStringAsync(HISTORY_FILE_PATH, JSON.stringify(history), {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      console.error('Error saving game history to FileSystem:', error);
    }
  },

  // Lê todas as partidas salvas do arquivo JSON. Se o arquivo não existir, retorna um array vazio
  async loadHistory(): Promise<GameHistory[]> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE_PATH);
      if (!fileInfo.exists) {
        return [];
      }
      
      // Lê o conteúdo do arquivo como string
      const fileContent = await FileSystem.readAsStringAsync(HISTORY_FILE_PATH, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      // Retorna o array de partidas parseando a string lida
      return JSON.parse(fileContent) as GameHistory[];
    } catch (error) {
      console.error('Error loading game history from FileSystem:', error);
      return [];
    }
  },

  // Exclui completamente o arquivo de histórico de partidas (reset total)
  async clearHistory(): Promise<void> {
    try {
      await FileSystem.deleteAsync(HISTORY_FILE_PATH, { idempotent: true }); // idempotent evita erro se o arquivo não existir
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
};

