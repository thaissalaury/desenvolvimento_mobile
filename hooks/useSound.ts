import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const clickSoundAsset = require('../assets/sounds/click.wav');
const correctSoundAsset = require('../assets/sounds/correct.wav');
const wrongSoundAsset = require('../assets/sounds/wrong.wav');
const victorySoundAsset = require('../assets/sounds/victory.wav');

export function useSound() {
  const clickSoundRef = useRef<Audio.Sound | null>(null);
  const correctSoundRef = useRef<Audio.Sound | null>(null);
  const wrongSoundRef = useRef<Audio.Sound | null>(null);
  const victorySoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configure audio mode
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
    }).catch(err => console.log('Audio mode config error:', err));

    // Load sounds on mount
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

    // Unload sounds on unmount
    return () => {
      clickSoundRef.current?.unloadAsync();
      correctSoundRef.current?.unloadAsync();
      wrongSoundRef.current?.unloadAsync();
      victorySoundRef.current?.unloadAsync();
    };
  }, []);

  const playClick = async () => {
    try {
      if (clickSoundRef.current) {
        await clickSoundRef.current.replayAsync();
      }
    } catch (e) {
      console.log('Play click sound error:', e);
    }
  };

  const playCorrect = async () => {
    try {
      if (correctSoundRef.current) {
        await correctSoundRef.current.replayAsync();
      }
    } catch (e) {
      console.log('Play correct sound error:', e);
    }
  };

  const playWrong = async () => {
    try {
      if (wrongSoundRef.current) {
        await wrongSoundRef.current.replayAsync();
      }
    } catch (e) {
      console.log('Play wrong sound error:', e);
    }
  };

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
