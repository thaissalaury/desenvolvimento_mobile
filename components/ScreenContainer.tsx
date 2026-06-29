import React from 'react';
import { StyleSheet, View, SafeAreaView, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  statusBarStyle?: 'light' | 'dark' | 'auto';
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  gradient = true,
  statusBarStyle = 'dark',
}) => {
  const content = (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.innerContainer, style]}>
        {children}
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <StatusBar style={statusBarStyle} />
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
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  innerContainer: {
    flex: 1,
  },
});
