import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

export default function FlashCard({ letter, color, isRTL, onFlipChange }) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setFlipped(false);
    flipAnim.setValue(0);
  }, [letter, flipAnim]);

  const handleFlip = () => {
    const toValue = flipped ? 0 : 1;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
    const next = !flipped;
    setFlipped(next);
    onFlipChange && onFlipChange(next);
  };

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontScale = flipAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.94] });
  const backScale = flipAnim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });

  const cardBg = color + '22';
  const cardBorder = color + 'bb';

  const charStyle = [
    styles.char,
    isRTL && styles.charRTL,
    letter.char.length > 1 && styles.charSmall,
  ];

  return (
    <TouchableOpacity onPress={handleFlip} activeOpacity={0.92} style={styles.wrapper}>
      <View style={styles.glowLayer} pointerEvents="none" />
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: cardBg, borderColor: cardBorder },
          { transform: [{ perspective: 1200 }, { rotateY: frontRotate }, { scale: frontScale }] },
        ]}
      >
        <Text style={charStyle}>{letter.char}</Text>
        <Text style={[styles.hint, { color: color + 'cc' }]}>tap to reveal</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.cardAbsolute,
          { backgroundColor: cardBg, borderColor: cardBorder },
          { transform: [{ perspective: 1200 }, { rotateY: backRotate }, { scale: backScale }] },
        ]}
      >
        <Text style={[styles.romanized, { color }]}>{letter.romanized}</Text>
        <Text style={styles.ipa}>/{letter.ipa}/</Text>
        <View style={[styles.divider, { backgroundColor: color + '33' }]} />
        <Text style={styles.exampleLabel}>example</Text>
        <Text style={[styles.example, isRTL && styles.exampleRTL]}>{letter.example}</Text>
        <Text style={[styles.hint, { color: color + 'cc', marginTop: 18 }]}>tap to flip back</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    aspectRatio: 0.75,
    maxWidth: 360,
    alignSelf: 'center',
    position: 'relative',
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    backgroundColor: '#ffffff0d',
    shadowColor: '#ffffff',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  card: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
  },
  cardAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  char: {
    fontSize: 118,
    color: '#f5f7ff',
    fontWeight: '300',
    lineHeight: 130,
    textAlign: 'center',
  },
  charSmall: {
    fontSize: 82,
    lineHeight: 92,
  },
  charRTL: {
    writingDirection: 'rtl',
  },
  romanized: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
    textAlign: 'center',
  },
  ipa: {
    fontSize: 18,
    color: '#bcc0e0',
    marginBottom: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  divider: {
    width: 46,
    height: 1,
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 11,
    color: '#96a0d4',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  example: {
    fontSize: 15,
    color: '#d9dee8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 5,
  },
  exampleRTL: {
    writingDirection: 'rtl',
  },
  hint: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 24,
    color: '#aeb4dc',
  },
});
