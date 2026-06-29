import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useQuiz } from '../contexts/QuizContext';
import { useSound } from '../hooks/useSound';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const { stats } = useQuiz();
  const { playClick } = useSound();
  const [showSplash, setShowSplash] = useState(true);

  // Animation values
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const homeFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Splash screen animation
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Transition to Home Screen after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(logoFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
        // Fade in Home Screen
        Animated.timing(homeFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    playClick();
    router.push('/category');
  };

  const handleAbout = () => {
    playClick();
    router.push('/about');
  };

  if (showSplash) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4F46E5', '#6366F1', '#4338CA']}
          style={styles.gradient}
        >
          <Animated.View
            style={[
              styles.splashContent,
              { opacity: logoFade, transform: [{ scale: logoScale }] },
            ]}
          >
            <View style={styles.logoBadge}>
              <Ionicons name="trophy" size={60} color="#FFFFFF" />
            </View>
            <Text style={styles.splashTitle}>QuizMaster</Text>
            <Text style={styles.splashSubtitle}>Teste sua mente</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EEF2FF', '#F8FAFC']}
        style={styles.gradient}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ opacity: homeFade }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.logoSmall}>
              <Ionicons name="trophy" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>QuizMaster</Text>
            <Text style={styles.subtitle}>Desafie seu conhecimento.</Text>
          </View>

          {/* Stats Overview */}
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Suas Estatísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Ionicons name="play" size={22} color={COLORS.primary} />
                <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
                <Text style={styles.statLabel}>Partidas</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="ribbon" size={22} color="#EAB308" />
                <Text style={styles.statValue}>{stats.highestScore}%</Text>
                <Text style={styles.statLabel}>Recorde</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="flame" size={22} color="#EF4444" />
                <Text style={styles.statValue}>{stats.bestStreak}</Text>
                <Text style={styles.statLabel}>Sequência</Text>
              </View>
            </View>
          </Card>

          <View style={styles.buttonSection}>
            <Button
              title="Iniciar Quiz"
              onPress={handleStart}
              style={styles.startButton}
              icon={<Ionicons name="play-circle" size={22} color="#FFFFFF" />}
            />
            <Button
              title="Sobre o App"
              onPress={handleAbout}
              variant="outline"
              style={styles.aboutButton}
              icon={<Ionicons name="information-circle-outline" size={22} color={COLORS.primary} />}
            />
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  // Splash Screen Styles
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  splashTitle: {
    fontSize: 42,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SPACING.xs,
  },
  // Home Screen Styles
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: COLORS.text.secondary,
  },
  statsCard: {
    marginBottom: SPACING.xl,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: COLORS.text.light,
    marginTop: 2,
  },
  buttonSection: {
    gap: SPACING.md,
  },
  startButton: {
    width: '100%',
  },
  aboutButton: {
    width: '100%',
  },
});
