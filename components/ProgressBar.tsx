import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

// Definição das propriedades da barra de progresso (ProgressBar)
interface ProgressBarProps {
  progress: number; // Valor fracionário de 0 a 1 indicando o progresso atual
  style?: ViewStyle;
}

// Componente de Barra de Progresso animada para indicar o avanço das perguntas
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, style }) => {
  // Inicializa o valor animado baseado no progresso recebido
  const animation = useRef(new Animated.Value(progress)).current;

  // Efeito disparado sempre que a propriedade 'progress' muda
  useEffect(() => {
    // Inicia uma animação suave de transição de valor com duração de 300ms
    Animated.timing(animation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false, // Necessário false pois estamos animando largura de componente layout
    }).start();
  }, [progress]);

  // Interpola a largura animada de valores numéricos de 0 a 1 para strings de porcentagem '0%' a '100%'
  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Exibe a barra interna preenchendo gradualmente a largura com base no valor interpolado */}
      <Animated.View style={[styles.bar, { width }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    width: '100%',
  },
  bar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
  },
});

