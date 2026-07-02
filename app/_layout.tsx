import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { QuizProvider } from '../contexts/QuizContext';

// Evita que a tela de splash (carregamento inicial) desapareça automaticamente
// antes que todas as fontes e recursos do app sejam carregados completamente.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

// Componente Layout Raiz do aplicativo (RootLayout)
export default function RootLayout() {
  // Carrega assincronamente as variantes da fonte customizada "Outfit" do Google Fonts
  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-Bold': Outfit_700Bold,
  });

  // Efeito executado quando as fontes terminam de carregar ou quando ocorre algum erro
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Oculta a tela de splash, permitindo que a interface principal apareça
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
    }
  }, [fontsLoaded, fontError]);

  // Se as fontes ainda não foram carregadas e não houve erro, exibe uma tela em branco temporária
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // Provedor do Contexto do Quiz (compartilha o estado do jogo entre todas as telas)
    <QuizProvider>
      {/* Configuração do navegador de pilha (Stack Navigation) do Expo Router */}
      <Stack
        screenOptions={{
          headerShown: false, // Oculta o cabeçalho padrão em todas as telas
          animation: 'fade_from_bottom', // Efeito de transição suave de baixo para cima
        }}
      >
        {/* Registro das telas disponíveis no sistema de roteamento do aplicativo */}
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
        <Stack.Screen name="category" />
        <Stack.Screen name="difficulty" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="results" />
      </Stack>
    </QuizProvider>
  );
}

