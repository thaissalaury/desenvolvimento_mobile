import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// Importação estática dos recursos de áudio locais (arquivos WAV)
const clickSoundAsset = require('../assets/sounds/click.wav');
const correctSoundAsset = require('../assets/sounds/correct.wav');
const wrongSoundAsset = require('../assets/sounds/wrong.wav');
const victorySoundAsset = require('../assets/sounds/victory.wav');

// Hook customizado para gerenciar a reprodução de efeitos sonoros no aplicativo
export function useSound() {
  // Referências mutáveis para armazenar as instâncias de áudio carregadas do Expo AV
  const clickSoundRef = useRef<Audio.Sound | null>(null);
  const correctSoundRef = useRef<Audio.Sound | null>(null);
  const wrongSoundRef = useRef<Audio.Sound | null>(null);
  const victorySoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configura as opções globais de áudio no iOS e Android para reproduzir sons corretamente
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,       // Permite tocar sons mesmo no modo silencioso do iOS
      staysActiveInBackground: false,   // Pausa o som se o app for para segundo plano
      playThroughEarpieceAndroid: false, // Força a saída de som pelo alto-falante principal (não fone de ouvido de chamada)
    }).catch(err => console.log('Audio mode config error:', err));

    // Carrega assincronamente todos os arquivos de áudio em memória quando o componente monta
    const loadSounds = async () => {
      try {
        const { sound: click } = await Audio.Sound.createAsync(clickSoundAsset);
        clickSoundRef.current = click;

        const { sound: correct } = await Audio.Sound.createAsync(correctSoundAsset);
        correctSoundRef.current = correct;

        const { sound: wrong } = await Audio.Sound.createAsync(wrongSoundAsset);
        wrongSoundRef.current = wrong;

        const { sound: victory } = await Audio.Sound.createAsync(victorySoundAsset);
        victorySoundRef.current = victory;
      } catch (error) {
        console.error('Failed to load sound assets:', error);
      }
    };

    loadSounds();

    // Descarrega todos os arquivos de áudio da memória ao desmontar o hook para evitar vazamentos de memória (memory leaks)
    return () => {
      clickSoundRef.current?.unloadAsync();
      correctSoundRef.current?.unloadAsync();
      wrongSoundRef.current?.unloadAsync();
      victorySoundRef.current?.unloadAsync();
    };
  }, []);

  // Toca o som de clique padrão
  const playClick = async () => {
    try {
      if (clickSoundRef.current) {
        await clickSoundRef.current.replayAsync(); // replayAsync garante que reinicie se já estiver tocando
      }
    } catch (e) {
      console.log('Play click sound error:', e);
    }
  };

  // Toca o som de resposta correta
  const playCorrect = async () => {
    try {
      if (correctSoundRef.current) {
        await correctSoundRef.current.replayAsync();
      }
    } catch (e) {
      console.log('Play correct sound error:', e);
    }
  };

  // Toca o som de resposta errada
  const playWrong = async () => {
    try {
      if (wrongSoundRef.current) {
        await wrongSoundRef.current.replayAsync();
      }
    } catch (e) {
      console.log('Play wrong sound error:', e);
    }
  };

  // Toca o som de vitória ao finalizar o quiz com alta pontuação
  const playVictory = async () => {
    try {
      if (victorySoundRef.current) {
        await victorySoundRef.current.replayAsync();
      }
    } catch (e) {
      console.log('Play victory sound error:', e);
    }
  };

  return { playClick, playCorrect, playWrong, playVictory };
}

