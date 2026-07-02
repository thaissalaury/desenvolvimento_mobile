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

// Interface tipando a estrutura estática de cada categoria de jogo
interface CategoryItem {
  name: string;                                // Nome lógico inglês da categoria (usa para filtrar perguntas)
  displayName: string;                         // Nome amigável em português exibido na tela
  icon: keyof typeof Ionicons.glyphMap;        // Nome do ícone da biblioteca Ionicons
  color: string;                               // Cor temática da categoria para o círculo de ícone
}

// Lista estática com as categorias disponíveis no QuizMaster
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

// Tela de Seleção de Categoria (CategorySelection)
export default function CategorySelection() {
  const router = useRouter();
  const { selectedCategory, selectCategory } = useQuiz(); // Métodos e estado do contexto global
  const { playClick } = useSound();

  // Seleciona a categoria e toca som de feedback
  const handleSelect = (categoryName: string) => {
    playClick();
    selectCategory(categoryName);
  };

  // Avança para a seleção de dificuldade se houver categoria selecionada
  const handleContinue = () => {
    playClick();
    router.push('/difficulty');
  };

  return (
    <ScreenContainer statusBarStyle="dark">
      {/* Cabeçalho superior */}
      <Header title="Escolha a Categoria" />
      <View style={styles.content}>
        <Text style={styles.instruction}>
          Selecione um tema abaixo para desafiar suas habilidades:
        </Text>

        {/* ScrollView renderizando a grid flexbox de duas colunas contendo os Cards clicáveis */}
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {CATEGORIES.map((category) => {
            // Verifica se este item específico é a categoria atualmente selecionada
            const isSelected = selectedCategory?.toLowerCase() === category.name.toLowerCase();
            return (
              <Card
                key={category.name}
                onPress={() => handleSelect(category.name)}
                style={[
                  styles.categoryCard,
                  // Aplica bordas e fundos destacados se estiver selecionada
                  isSelected ? { borderColor: COLORS.primary, backgroundColor: '#EEF2FF' } : {},
                ]}
              >
                {/* Ícone com círculo de fundo translúcido na cor da categoria */}
                <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                  <Ionicons
                    name={category.icon}
                    size={28}
                    color={isSelected ? COLORS.primary : category.color}
                  />
                </View>
                {/* Texto da categoria */}
                <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                  {category.displayName}
                </Text>
                {/* Badge/Selo de marcação de check no canto superior direito do Card se selecionado */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Card>
            );
          })}
        </ScrollView>

        {/* Rodapé fixado com botão para continuar (habilitado apenas se houver seleção) */}
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

