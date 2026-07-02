import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import * as Haptics from 'expo-haptics';

// Definição das propriedades do botão customizado (Button)
interface ButtonProps {
  title: string;                         // Texto exibido no botão
  onPress: () => void;                   // Função callback disparada ao pressionar
  variant?: 'primary' | 'secondary' | 'outline'; // Variantes visuais do botão
  disabled?: boolean;                    // Define se o botão está desabilitado
  icon?: React.ReactNode;                // Ícone opcional renderizado ao lado do texto
  style?: ViewStyle;                     // Estilo customizado do container do botão
  textStyle?: TextStyle;                 // Estilo customizado do texto do botão
  hapticFeedback?: boolean;              // Controla se haverá feedback tátil ao tocar
}

// Botão personalizado premium reutilizável em todo o QuizMaster
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  // Trata o toque no botão, ignorando se estiver desabilitado
  const handlePress = () => {
    if (disabled) return;
    // Se ativado, gera uma vibração tátil sutil para melhor UX
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  // Agrupa os estilos do container baseado na variante e estado atual
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    disabled && styles.disabled,
    style,
  ];

  // Agrupa os estilos do texto baseado na variante e estado atual
  const textStyles = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        ...buttonStyles,
        // Efeito de encolhimento somente se for clicável
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {/* Renderiza o ícone se ele tiver sido fornecido */}
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={textStyles}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra sutil para o design premium do botão
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.text.white,
  },
  secondaryText: {
    color: COLORS.text.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: '#94A3B8',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }], // Efeito de clique físico encolhendo levemente
  },
});

