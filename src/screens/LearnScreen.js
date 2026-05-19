import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import { ALPHABETS } from '../data/alphabets';
import FlashCard from '../components/FlashCard';

export default function LearnScreen({ alphabetId, onBack }) {
  const alphabet = ALPHABETS[alphabetId];
  const [index, setIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [letters, setLetters] = useState(alphabet.letters);
  const soundScale = useRef(new Animated.Value(1)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const letter = letters[index];
  const isRTL = alphabet.direction === 'rtl';
  const total = letters.length;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [glow]);

  useEffect(() => {
    contentAnim.setValue(0);
    Animated.parallel([
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.spring(soundScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [letter, contentAnim, soundScale]);

  const speakLetter = useCallback(async () => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }

    Animated.sequence([
      Animated.spring(soundScale, { toValue: 0.86, speed: 60, useNativeDriver: true }),
      Animated.spring(soundScale, { toValue: 1, speed: 20, useNativeDriver: true }),
    ]).start();

    setIsSpeaking(true);
    try {
      await Speech.speak(letter.speak, {
        language: alphabet.language,
        pitch: 1.0,
        rate: 0.78,
        onDone: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          Alert.alert(
            'TTS unavailable',
            `The ${alphabet.name} voice pack may not be installed on this device.`
          );
        },
      });
    } catch {
      setIsSpeaking(false);
    }
  }, [letter, alphabet, isSpeaking]);

  const goTo = (newIndex) => {
    Speech.stop();
    setIsSpeaking(false);
    setIndex(newIndex);
  };

  const prev = () => goTo(index > 0 ? index - 1 : total - 1);
  const next = () => goTo(index < total - 1 ? index + 1 : 0);

  const toggleShuffle = () => {
    if (shuffled) {
      setLetters(alphabet.letters);
      setShuffled(false);
    } else {
      const copy = [...alphabet.letters];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      setLetters(copy);
      setShuffled(true);
    }
    setIndex(0);
    Speech.stop();
    setIsSpeaking(false);
  };

  const progress = (index + 1) / total;
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const contentTransform = {
    opacity: contentAnim,
    transform: [
      { translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
      { scale: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
    ],
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />
      <View style={styles.backgroundBubbles} pointerEvents="none">
        <View style={[styles.bubble, styles.bubbleOne]} />
        <View style={[styles.bubble, styles.bubbleTwo]} />
      </View>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Animated.Text style={[styles.alphabetName, { color: alphabet.color, transform: [{ scale: glowScale }] }]}> 
            {alphabet.flag}  {alphabet.name}
          </Animated.Text>
          <Text style={styles.nativeName}>{alphabet.nativeName}</Text>
        </View>

        <TouchableOpacity onPress={toggleShuffle} style={styles.shuffleBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.shuffleIcon, shuffled && { color: alphabet.color }]}>⇄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: alphabet.color }]} />
      </View>
      <Text style={styles.progressLabel}>
        {index + 1} / {total}
      </Text>

      <Animated.View style={[styles.cardArea, contentTransform]}>
        <FlashCard
          key={`${alphabetId}-${index}`}
          letter={letter}
          color={alphabet.color}
          isRTL={isRTL}
        />
      </Animated.View>

      <View style={styles.soundRow}>
        <Animated.View style={{ transform: [{ scale: soundScale }] }}>
          <TouchableOpacity
            onPress={speakLetter}
            style={[
              styles.soundBtn,
              { borderColor: alphabet.color },
              isSpeaking && { backgroundColor: alphabet.color + '24' },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.soundIcon, { color: alphabet.color }]}> 
              {isSpeaking ? '■' : '♪'}
            </Text>
            <Text style={[styles.soundLabel, { color: alphabet.color }]}> 
              {isSpeaking ? 'Stop' : 'Hear letter'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity onPress={prev} style={styles.navBtn} activeOpacity={0.75}>
          <Text style={styles.navArrow}>‹</Text>
          <Text style={styles.navLabel}>prev</Text>
        </TouchableOpacity>

        <View style={styles.navDots}>
          {letters.slice(Math.max(0, index - 2), Math.min(total, index + 3)).map((_, i) => {
            const dotIndex = Math.max(0, index - 2) + i;
            return (
              <TouchableOpacity key={dotIndex} onPress={() => goTo(dotIndex)}>
                <View
                  style={[
                    styles.dot,
                    dotIndex === index
                      ? { backgroundColor: alphabet.color, width: 20 }
                      : { backgroundColor: '#32344f' },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={next} style={styles.navBtn} activeOpacity={0.75}>
          <Text style={styles.navLabel}>next</Text>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#080913',
  },
  backgroundBubbles: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 200,
  },
  bubbleOne: {
    width: 240,
    height: 240,
    backgroundColor: '#4a90dd22',
    top: 30,
    left: -60,
  },
  bubbleTwo: {
    width: 180,
    height: 180,
    backgroundColor: '#ff5cbb22',
    top: 160,
    right: -50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  backArrow: {
    fontSize: 30,
    color: '#dbdfff',
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
  },
  alphabetName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.8,
    textShadowColor: '#00000055',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  nativeName: {
    fontSize: 12,
    color: '#8b93b6',
    marginTop: 3,
  },
  shuffleBtn: {
    width: 40,
    alignItems: 'flex-end',
  },
  shuffleIcon: {
    fontSize: 24,
    color: '#888',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#14172a',
    marginHorizontal: 16,
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#7b84b6',
    marginTop: 8,
    letterSpacing: 1,
  },
  cardArea: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  soundRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  soundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1.6,
    backgroundColor: '#0d1020',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  soundIcon: {
    fontSize: 20,
  },
  soundLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 26,
    paddingTop: 6,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  navArrow: {
    fontSize: 32,
    color: '#b5bfea',
    lineHeight: 36,
  },
  navLabel: {
    fontSize: 12,
    color: '#96a0d0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  navDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
