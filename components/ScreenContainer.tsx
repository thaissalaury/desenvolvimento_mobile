import React from 'react';
import { StyleSheet, View, SafeAreaView, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

// Definição das propriedades do ScreenContainer
interface ScreenContainerProps {
  children: React.ReactNode;                 // Elementos internos que serão renderizados na tela
  style?: ViewStyle;                         // Estilo customizado opcional
  gradient?: boolean;                        // Controla se a tela terá fundo degradê/gradiente ou cor sólida
  statusBarStyle?: 'light' | 'dark' | 'auto'; // Estilo da barra de status superior do dispositivo
}

// Container padrão de tela reutilizável para unificar o design, gradientes de fundo e espaçamento seguro
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  gradient = true,
  statusBarStyle = 'dark',
}) => {
  // Define o conteúdo da tela envelopado por SafeAreaView para evitar cortes em telas com entalhes (notches)
  const content = (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.innerContainer, style]}>
        {children}
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {/* Barra de Status nativa do celular (onde fica a bateria, relógio, etc.) */}
      <StatusBar style={statusBarStyle} />
      
      {/* Renderiza fundo com gradiente linear se 'gradient' for verdadeiro, senão fundo sólido */}
      {gradient ? (
        <LinearGradient
          colors={['#EEF2FF', '#F8FAFC']}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.solid, { backgroundColor: COLORS.background }]}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  solid: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    // Adiciona espaçamento superior apenas no Android para evitar que o conteúdo fique sob a barra de status
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  innerContainer: {
    flex: 1,
  },
});

