import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, style }) => {
  const animation = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
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
