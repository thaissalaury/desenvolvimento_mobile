import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { GameStats, GameHistory } from '../types';

const HISTORY_FILE_PATH = `${FileSystem.documentDirectory}history.json`;

const STATS_KEYS = {
  highestScore: 'quizmaster_highest_score',
  lastCategory: 'quizmaster_last_category',
  lastDifficulty: 'quizmaster_last_difficulty',
  gamesPlayed: 'quizmaster_games_played',
  bestStreak: 'quizmaster_best_streak',
};

export const StorageService = {
  // --- SecureStore (Stats) ---
  async saveStats(stats: GameStats): Promise<void> {
    try {
      await SecureStore.setItemAsync(STATS_KEYS.highestScore, String(stats.highestScore));
      if (stats.lastCategory) {
        await SecureStore.setItemAsync(STATS_KEYS.lastCategory, stats.lastCategory);
      } else {
        await SecureStore.deleteItemAsync(STATS_KEYS.lastCategory);
      }
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

  // --- FileSystem (Game History) ---
  async saveHistoryItem(item: GameHistory): Promise<void> {
    try {
      const history = await this.loadHistory();
      history.unshift(item); // Add to the beginning of the list
      await FileSystem.writeAsStringAsync(HISTORY_FILE_PATH, JSON.stringify(history), {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      console.error('Error saving game history to FileSystem:', error);
    }
  },

  async loadHistory(): Promise<GameHistory[]> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE_PATH);
      if (!fileInfo.exists) {
        return [];
      }
      const fileContent = await FileSystem.readAsStringAsync(HISTORY_FILE_PATH, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      return JSON.parse(fileContent) as GameHistory[];
    } catch (error) {
      console.error('Error loading game history from FileSystem:', error);
      return [];
    }
  },

  async clearHistory(): Promise<void> {
    try {
      await FileSystem.deleteAsync(HISTORY_FILE_PATH, { idempotent: true });
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
};
