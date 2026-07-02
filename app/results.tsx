import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';
import { useQuiz } from '../contexts/QuizContext';
import { useSound } from '../hooks/useSound';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Tela de Resultados (Results) - Apresenta o feedback final da partida do jogador
export default function Results() {
  const router = useRouter();
  const { score, filteredQuestions, startQuiz } = useQuiz(); // Recupera pontuações e métodos
  const { playClick, playVictory } = useSound();

  const total = filteredQuestions.length || 10;
  const percentage = Math.round((score / total) * 100); // Calcula a porcentagem final de acertos

  // Definição de mensagens e cores dinâmicas baseadas no aproveitamento do jogador
  let performanceMessage = '';
  let iconName: keyof typeof Ionicons.glyphMap = 'trophy-outline';
  let iconColor = COLORS.primary;

  if (percentage >= 80) {
    // Excelente: aproveitamento igual ou acima de 80% (Tema Dourado/Troféu)
    performanceMessage = 'Excelente!';
    iconName = 'trophy';
    iconColor = '#EAB308'; // Ouro
  } else if (percentage >= 50) {
    // Bom Trabalho: aproveitamento entre 50% e 79% (Tema Verde/Check)
    performanceMessage = 'Bom Trabalho!';
    iconName = 'checkmark-circle';
    iconColor = COLORS.success;
  } else {
    // Continue Praticando: aproveitamento abaixo de 50% (Tema Roxo/Gráfico subindo)
    performanceMessage = 'Continue Praticando!';
    iconName = 'trending-up';
    iconColor = COLORS.secondary;
  }

  // Valores de animação para a entrada triunfal do Card de pontuação
  const scaleAnim = useRef(new Animated.Value(0.3)).current; // Inicia o Card encolhido (escala 0.3)
  const opacityAnim = useRef(new Animated.Value(0)).current; // Inicia invisível (opacidade 0)

  useEffect(() => {
    // Toca som de vitória e aciona feedback tátil específico se o jogador teve ótimo desempenho (>= 80%)
    if (percentage >= 80) {
      playVictory();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Feedback tátil médio padrão
    }

    // Executa em paralelo a expansão elástica (spring) e o surgimento gradual (timing) do card de resultados
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [percentage]);

  // Reinicia o quiz com a mesma categoria e dificuldade, redirecionando para a tela de jogo
  const handlePlayAgain = () => {
    playClick();
    startQuiz(); // Zera estados e sorteia novas perguntas
    router.replace('/quiz');
  };

  // Retorna para a tela de início do aplicativo
  const handleGoHome = () => {
    playClick();
    router.replace('/');
  };

  return (
    <ScreenContainer statusBarStyle="dark">
      <View style={styles.content}>
        
        {/* Painel Centralizado e Animado de Resultados */}
        <Animated.View
          style={[
            styles.animatedContainer,
            { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Card style={styles.resultsCard}>
            {/* Círculo do Ícone Temático */}
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
              <Ionicons name={iconName} size={64} color={iconColor} />
            </View>

            <Text style={[styles.performanceText, { color: iconColor }]}>
              {performanceMessage}
            </Text>

            <Text style={styles.scoreText}>
              Você acertou {score} de {total} questões
            </Text>

            {/* Quadro com o Percentual de Aproveitamento */}
            <View style={styles.percentContainer}>
              <Text style={styles.percentNumber}>{percentage}%</Text>
              <Text style={styles.percentLabel}>Aproveitamento</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Seção de Botões de Ação para o Usuário */}
        <View style={styles.buttonSection}>
          <Button
            title="Jogar Novamente"
            onPress={handlePlayAgain}
            style={styles.actionButton}
            icon={<Ionicons name="refresh" size={22} color="#FFFFFF" />}
          />
          <Button
            title="Página Inicial"
            onPress={handleGoHome}
            variant="outline"
            style={styles.actionButton}
            icon={<Ionicons name="home-outline" size={22} color={COLORS.primary} />}
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
    paddingVertical: SPACING.xxl,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
  },
  resultsCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  performanceText: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    marginBottom: SPACING.xs,
  },
  scoreText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },
  percentContainer: {
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
    width: '80%',
    paddingTop: SPACING.lg,
  },
  percentNumber: {
    fontSize: 48,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
  },
  percentLabel: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: COLORS.text.light,
    marginTop: 2,
  },
  buttonSection: {
    width: '100%',
    gap: SPACING.md,
  },
  actionButton: {
    width: '100%',
  },
});

