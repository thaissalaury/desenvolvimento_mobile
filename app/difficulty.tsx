import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';
import { useQuiz } from '../contexts/QuizContext';
import { useSound } from '../hooks/useSound';
import { Ionicons } from '@expo/vector-icons';

interface DifficultyOption {
  key: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  { key: 'easy', title: 'Fácil', description: 'Perguntas tranquilas para aquecer a mente.', icon: 'leaf-outline', color: '#22C55E' },
  { key: 'medium', title: 'Médio', description: 'Perguntas com bom nível de desafio.', icon: 'flame-outline', color: '#F59E0B' },
  { key: 'hard', title: 'Difícil', description: 'Perguntas desafiadoras para experts.', icon: 'skull-outline', color: '#EF4444' },
];

export default function DifficultySelection() {
  const router = useRouter();
  const { selectedDifficulty, selectDifficulty, startQuiz } = useQuiz();
  const { playClick } = useSound();

  const handleSelect = (key: 'easy' | 'medium' | 'hard') => {
    playClick();
    selectDifficulty(key);
  };

  const handleStart = () => {
    playClick();
    startQuiz();
    router.push('/quiz');
  };

  return (
    <ScreenContainer statusBarStyle="dark">
      <Header title="Escolha a Dificuldade" />
      <View style={styles.content}>
        <Text style={styles.instruction}>
          Selecione o nível de dificuldade ideal para começar a sua jornada:
        </Text>

        <View style={styles.list}>
          {DIFFICULTIES.map((option) => {
            const isSelected = selectedDifficulty === option.key;
            return (
              <Card
                key={option.key}
                onPress={() => handleSelect(option.key)}
                style={[
                  styles.difficultyCard,
                  isSelected ? { borderColor: COLORS.primary, backgroundColor: '#EEF2FF' } : {},
                ]}
              >
                <View style={styles.cardLayout}>
                  <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}>
                    <Ionicons
                      name={option.icon}
                      size={26}
                      color={isSelected ? COLORS.primary : option.color}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[styles.optionTitle, isSelected && styles.selectedTitle]}>
                      {option.title}
                    </Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </Card>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Button
            title="Começar Jogo"
            onPress={handleStart}
            disabled={!selectedDifficulty}
            style={styles.startButton}
            icon={<Ionicons name="play-circle-outline" size={22} color="#FFFFFF" />}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  instruction: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: COLORS.text.secondary,
    marginVertical: SPACING.md,
    textAlign: 'center',
  },
  list: {
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  difficultyCard: {
    paddingVertical: SPACING.md,
  },
  cardLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
  },
  selectedTitle: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: 13,
    fontFamily: 'Outfit-Regular',
    color: COLORS.text.light,
    marginTop: 2,
  },
  selectedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  startButton: {
    width: '100%',
  },
});
