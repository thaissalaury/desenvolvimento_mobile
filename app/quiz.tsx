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

// Tela Principal de Jogo do Quiz (Quiz) - Renderiza a pergunta ativa e suas alternativas
export default function Quiz() {
  const router = useRouter();
  const {
    filteredQuestions,
    currentQuestionIndex,
    answerQuestion,
    nextQuestion,
    finishQuiz,
  } = useQuiz(); // Recupera estados e métodos do contexto global
  
  const { playCorrect, playWrong } = useSound(); // Sons de feedback de acerto/erro
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Grava a opção selecionada nesta pergunta
  const [isAnswered, setIsAnswered] = useState(false); // Bloqueia interações após responder

  const question = filteredQuestions[currentQuestionIndex];

  // Caso não existam perguntas carregadas (ex: navegação indevida), exibe tela de erro
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

  // Trata o toque na alternativa de resposta escolhida
  const handleOptionPress = async (option: string) => {
    if (isAnswered) return; // Evita cliques múltiplos
    
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === question.correctAnswer;
    answerQuestion(isCorrect); // Registra a resposta no contexto para contabilidade do score

    // Executa Feedbacks de Áudio e Vibrações táteis (Haptics)
    if (isCorrect) {
      playCorrect();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      playWrong();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Avanço automático com delay de 1.5 segundos (tempo para o usuário ver se acertou ou errou)
    setTimeout(async () => {
      const hasNext = nextQuestion();
      if (hasNext) {
        // Zera os estados locais temporários da pergunta para a próxima
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Caso chegue ao fim do Quiz (10 perguntas), finaliza gravando os dados e vai para Resultados
        await finishQuiz();
        router.replace('/results');
      }
    }, 1500);
  };

  // Caixa de diálogo de alerta caso o usuário clique no botão de voltar/sair
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

  // Fração decimal representando a porcentagem atual da barra de progresso (ex: 0.1, 0.2, etc.)
  const progress = (currentQuestionIndex + 1) / filteredQuestions.length;

  return (
    <ScreenContainer statusBarStyle="dark">
      {/* Cabeçalho superior com interceptação do botão voltar físico/nátivo para o método handleQuit */}
      <Header title="QuizMaster" showBackButton={true} onBackPress={handleQuit} />
      
      <View style={styles.content}>
        {/* Painel do Progresso Superior */}
        <View style={styles.progressSection}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.categoryLabel}>{question.category}</Text>
            <Text style={styles.counterText}>
              Pergunta {currentQuestionIndex + 1} de {filteredQuestions.length}
            </Text>
          </View>
          {/* Barra de Progresso Animada */}
          <ProgressBar progress={progress} />
        </View>

        {/* Quadro com o enunciado da Pergunta */}
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Lista de Alternativas de Resposta */}
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

