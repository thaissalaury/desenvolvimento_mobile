import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { AnswerCard } from '../components/AnswerCard';
import { COLORS, SPACING } from '../constants/theme';
import { useQuiz } from '../contexts/QuizContext';
import { useSound } from '../hooks/useSound';
import * as Haptics from 'expo-haptics';

export default function Quiz() {
  const router = useRouter();
  const {
    filteredQuestions,
    currentQuestionIndex,
    answerQuestion,
    nextQuestion,
    finishQuiz,
  } = useQuiz();
  
  const { playCorrect, playWrong } = useSound();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = filteredQuestions[currentQuestionIndex];

  // If for some reason we have no questions (e.g., direct navigation), show a message
  if (!question) {
    return (
      <ScreenContainer>
        <Header title="Quiz" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Nenhuma pergunta carregada. Por favor, reinicie.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleOptionPress = async (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === question.correctAnswer;
    answerQuestion(isCorrect);

    // Audio & Haptics Feedback
    if (isCorrect) {
      playCorrect();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      playWrong();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Auto-advance after 1.5 seconds
    setTimeout(async () => {
      const hasNext = nextQuestion();
      if (hasNext) {
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Finish Quiz and save statistics
        await finishQuiz();
        router.replace('/results');
      }
    }, 1500);
  };

  const handleQuit = () => {
    Alert.alert(
      'Sair do Jogo',
      'Tem certeza de que deseja sair? Seu progresso nesta partida será perdido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => router.replace('/'),
        },
      ]
    );
  };

  const progress = (currentQuestionIndex + 1) / filteredQuestions.length;

  return (
    <ScreenContainer statusBarStyle="dark">
      <Header title="QuizMaster" showBackButton={true} onBackPress={handleQuit} />
      
      <View style={styles.content}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.categoryLabel}>{question.category}</Text>
            <Text style={styles.counterText}>
              Pergunta {currentQuestionIndex + 1} de {filteredQuestions.length}
            </Text>
          </View>
          <ProgressBar progress={progress} />
        </View>

        {/* Question Section */}
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Answers List */}
        <View style={styles.answersSection}>
          {question.answers.map((option) => {
            const isSelected = selectedOption === option;
            const showCorrect = isAnswered && option === question.correctAnswer;
            const showWrong = isAnswered && isSelected && option !== question.correctAnswer;

            return (
              <AnswerCard
                key={option}
                text={option}
                onPress={() => handleOptionPress(option)}
                isSelected={isSelected}
                isCorrect={showCorrect}
                isWrong={showWrong}
                disabled={isAnswered}
              />
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: SPACING.sm,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
    color: COLORS.primary,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.light,
  },
  questionSection: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  questionText: {
    fontSize: 22,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
    lineHeight: 32,
    textAlign: 'center',
  },
  answersSection: {
    width: '100%',
  },
});
