import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable, StyleProp } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

// Definição das propriedades do componente Card
interface CardProps {
  children: React.ReactNode;     // Conteúdo interno do cartão
  style?: StyleProp<ViewStyle>;  // Estilos adicionais customizados
  onPress?: () => void;          // Função disparada ao clicar (opcional)
}

// Componente Card reutilizável. Funciona de forma estática (View) ou clicável (Pressable com micro-animação)
export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  // Caso tenha ação de clique (onPress), renderiza usando Pressable com efeito visual ao tocar
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          styles.pressable,
          pressed && styles.pressed, // Aplica efeito de encolhimento e opacidade ao ser pressionado
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  // Caso contrário, renderiza apenas como uma caixa estática (View)
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Efeito de sombra premium e suave (iOS)
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    // Efeito de elevação de sombra (Android)
    elevation: 3,
  },
  pressable: {
    transform: [{ scale: 1 }],
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }], // Reduz ligeiramente o tamanho do card ao tocar
  },
});

