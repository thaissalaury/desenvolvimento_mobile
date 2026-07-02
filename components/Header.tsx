import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Definição das propriedades do cabeçalho customizado (Header)
interface HeaderProps {
  title: string;                 // Título exibido no cabeçalho
  showBackButton?: boolean;      // Indica se o botão de voltar deve aparecer
  onBackPress?: () => void;      // Callback personalizado para ação de voltar
  rightAction?: React.ReactNode; // Elemento opcional alinhado à direita
}

// Cabeçalho customizado reutilizável nas telas do aplicativo
export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightAction,
}) => {
  const router = useRouter();

  // Função para lidar com o pressionamento do botão de voltar
  const handleBack = () => {
    // Aciona um feedback tátil leve (vibração rápida)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress(); // Executa o callback customizado se fornecido
    } else {
      router.back(); // Volta para a tela anterior no Expo Router
    }
  };

  return (
    <View style={styles.container}>
      {/* Lado esquerdo: exibe o botão de voltar se showBackButton for verdadeiro */}
      <View style={styles.leftContainer}>
        {showBackButton && (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </Pressable>
        )}
      </View>

      {/* Centro: exibe o título da tela com limite de 1 linha */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Lado direito: espaço reservado para ações adicionais no cabeçalho */}
      <View style={styles.rightContainer}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: 56,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: SPACING.xs,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
});

