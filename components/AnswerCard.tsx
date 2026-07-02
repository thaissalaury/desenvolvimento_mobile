import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, View } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Definição das propriedades do cartão de resposta (AnswerCard)
interface AnswerCardProps {
  text: string;           // Texto da alternativa de resposta
  onPress: () => void;     // Callback disparado ao selecionar a alternativa
  isSelected: boolean;     // Indica se o usuário marcou esta alternativa
  isCorrect?: boolean;     // Indica se a resposta está correta (revelada após responder)
  isWrong?: boolean;       // Indica se a resposta está errada (revelada após responder)
  disabled?: boolean;      // Bloqueia interações após a resposta ser dada
  style?: ViewStyle;       // Estilo customizado extra
}

// Componente para renderizar as opções de resposta no Quiz, com feedbacks visuais dinâmicos
export const AnswerCard: React.FC<AnswerCardProps> = ({
  text,
  onPress,
  isSelected,
  isCorrect,
  isWrong,
  disabled = false,
  style,
}) => {
  let cardStyles: any[] = [styles.card];
  let textStyles: any[] = [styles.text];
  let iconName: any = null;
  let iconColor = '';

  // Determina o estado visual do componente com base nas propriedades recebidas
  if (isCorrect) {
    // Estado correto: borda verde, fundo verde claro e ícone de checkmark
    cardStyles.push(styles.correctCard);
    textStyles.push(styles.correctText);
    iconName = 'checkmark-circle';
    iconColor = COLORS.success;
  } else if (isWrong) {
    // Estado errado: borda vermelha, fundo vermelho claro e ícone de "X"
    cardStyles.push(styles.wrongCard);
    textStyles.push(styles.wrongText);
    iconName = 'close-circle';
    iconColor = COLORS.error;
  } else if (isSelected) {
    // Estado selecionado (antes da validação): borda roxa/indigo e fundo roxo claro
    cardStyles.push(styles.selectedCard);
    textStyles.push(styles.selectedText);
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        ...cardStyles,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.container}>
        <Text style={textStyles}>{text}</Text>
        {/* Renderiza o ícone de feedback apenas após a resposta ser submetida (isCorrect ou isWrong) */}
        {iconName && (
          <Ionicons name={iconName} size={22} color={iconColor} style={styles.icon} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.primary,
    flex: 1,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  selectedText: {
    color: COLORS.primary,
    fontFamily: 'Outfit-Bold',
  },
  correctCard: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FDF4',
  },
  correctText: {
    color: COLORS.success,
    fontFamily: 'Outfit-Bold',
  },
  wrongCard: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  wrongText: {
    color: COLORS.error,
    fontFamily: 'Outfit-Bold',
  },
  icon: {
    marginLeft: SPACING.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});

