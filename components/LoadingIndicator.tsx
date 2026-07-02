import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

// Definição das propriedades do indicador de carregamento
interface LoadingIndicatorProps {
  message?: string; // Mensagem opcional de carregamento exibida ao usuário
}

// Componente indicador de carregamento (Loading) centralizado e estilizado
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Carregando...',
}) => {
  return (
    <View style={styles.container}>
      {/* Exibe o spinner nativo girando na cor primária do aplicativo */}
      <ActivityIndicator size="large" color={COLORS.primary} />
      {/* Exibe a mensagem descritiva do carregamento se fornecida */}
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.secondary,
  },
});

