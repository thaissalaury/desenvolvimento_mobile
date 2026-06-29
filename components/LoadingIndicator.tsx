import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Carregando...',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
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
