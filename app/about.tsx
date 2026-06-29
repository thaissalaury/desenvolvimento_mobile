import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';
import { useQuiz } from '../contexts/QuizContext';
import { Ionicons } from '@expo/vector-icons';
import { useSound } from '../hooks/useSound';

export default function About() {
  const { clearAllHistory, history } = useQuiz();
  const { playClick } = useSound();

  const handleClearHistory = () => {
    playClick();
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza de que deseja apagar todo o seu histórico de jogos e redefinir suas estatísticas? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearAllHistory();
            Alert.alert('Sucesso', 'Todo o histórico e estatísticas foram limpos.');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer statusBarStyle="dark">
      <Header title="Sobre o App" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Info Card */}
        <Card style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy-outline" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>QuizMaster</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
          <Text style={styles.description}>
            O QuizMaster é um aplicativo completo de perguntas e respostas offline projetado para testar seus conhecimentos em diversas áreas, incluindo Ciência, História, Geografia, Tecnologia, Filmes, Música e Esportes.
          </Text>
        </Card>

        {/* Tech Stack Card */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Tecnologias Utilizadas</Text>
          <View style={styles.techList}>
            <View style={styles.techItem}>
              <Ionicons name="logo-react" size={20} color="#61DAFB" />
              <Text style={styles.techText}>React Native + TypeScript</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="phone-portrait-outline" size={20} color={COLORS.primary} />
              <Text style={styles.techText}>Expo SDK 54</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="git-branch-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.techText}>Expo Router (Navegação)</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="volume-medium-outline" size={20} color={COLORS.success} />
              <Text style={styles.techText}>Expo AV (Efeitos Sonoros)</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="key-outline" size={20} color="#F59E0B" />
              <Text style={styles.techText}>Expo SecureStore (Estatísticas)</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="folder-open-outline" size={20} color="#3B82F6" />
              <Text style={styles.techText}>Expo FileSystem (Histórico)</Text>
            </View>
          </View>
        </Card>

        {/* Game History List */}
        {history.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Últimos Jogos</Text>
            <View style={styles.historyList}>
              {history.slice(0, 5).map((game) => (
                <View key={game.id} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyCategory}>{game.category}</Text>
                    <Text style={styles.historyDate}>{game.date}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyScore}>
                      {game.score}/{game.totalQuestions}
                    </Text>
                    <Text style={styles.historyPercent}>{game.percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Storage Actions */}
        <Button
          title="Limpar Histórico e Dados"
          onPress={handleClearHistory}
          variant="outline"
          style={styles.clearButton}
          textStyle={{ color: COLORS.error }}
          icon={<Ionicons name="trash-outline" size={20} color={COLORS.error} />}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
  },
  version: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.light,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  techList: {
    width: '100%',
    gap: SPACING.sm,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  techText: {
    fontSize: 15,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.secondary,
  },
  clearButton: {
    borderColor: COLORS.error,
    marginTop: SPACING.md,
  },
  historyList: {
    width: '100%',
    gap: SPACING.sm,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyLeft: {
    flex: 1,
  },
  historyCategory: {
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
    color: COLORS.text.primary,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: COLORS.text.light,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyScore: {
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
    color: COLORS.primary,
  },
  historyPercent: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: COLORS.text.secondary,
  },
});
