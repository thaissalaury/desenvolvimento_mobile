import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useQuiz } from '../contexts/QuizContext';
import { useSound } from '../hooks/useSound';
import { Ionicons } from '@expo/vector-icons';

interface CategoryItem {
  name: string;
  displayName: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  { name: 'General Knowledge', displayName: 'Conhecimentos Gerais', icon: 'earth-outline', color: '#3B82F6' },
  { name: 'Science', displayName: 'Ciência', icon: 'flask-outline', color: '#10B981' },
  { name: 'History', displayName: 'História', icon: 'library-outline', color: '#F59E0B' },
  { name: 'Geography', displayName: 'Geografia', icon: 'map-outline', color: '#8B5CF6' },
  { name: 'Technology', displayName: 'Tecnologia', icon: 'hardware-chip-outline', color: '#EC4899' },
  { name: 'Movies', displayName: 'Filmes', icon: 'film-outline', color: '#EF4444' },
  { name: 'Music', displayName: 'Música', icon: 'musical-notes-outline', color: '#06B6D4' },
  { name: 'Sports', displayName: 'Esportes', icon: 'football-outline', color: '#10B981' },
];

export default function CategorySelection() {
  const router = useRouter();
  const { selectedCategory, selectCategory } = useQuiz();
  const { playClick } = useSound();

  const handleSelect = (categoryName: string) => {
    playClick();
    selectCategory(categoryName);
  };

  const handleContinue = () => {
    playClick();
    router.push('/difficulty');
  };

  return (
    <ScreenContainer statusBarStyle="dark">
      <Header title="Escolha a Categoria" />
      <View style={styles.content}>
        <Text style={styles.instruction}>
          Selecione um tema abaixo para desafiar suas habilidades:
        </Text>

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory?.toLowerCase() === category.name.toLowerCase();
            return (
              <Card
                key={category.name}
                onPress={() => handleSelect(category.name)}
                style={[
                  styles.categoryCard,
                  isSelected ? { borderColor: COLORS.primary, backgroundColor: '#EEF2FF' } : {},
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                  <Ionicons
                    name={category.icon}
                    size={28}
                    color={isSelected ? COLORS.primary : category.color}
                  />
                </View>
                <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                  {category.displayName}
                </Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Card>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Continuar"
            onPress={handleContinue}
            disabled={!selectedCategory}
            style={styles.continueButton}
            icon={<Ionicons name="arrow-forward-outline" size={20} color="#FFFFFF" />}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
    gap: SPACING.md,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
    position: 'relative',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: COLORS.primary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: 'transparent',
  },
  continueButton: {
    width: '100%',
  },
});
