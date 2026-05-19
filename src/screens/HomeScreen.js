import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { ALPHABET_LIST } from '../data/alphabets';

export default function HomeScreen({ onSelectAlphabet }) {
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, [fade, pulse]);

  const titleScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const headerStyle = {
    opacity: fade,
    transform: [
      {
        translateY: fade.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
      { scale: titleScale },
    ],
  };

  const renderItem = ({ item, index }) => {
    const sample = item.letters.slice(0, 5).map((l) => l.char).join('  ');
    return (
      <TouchableOpacity
        style={[
          styles.card,
          { borderColor: item.color + '88', shadowColor: item.color },
          index % 2 === 0 && styles.cardOffset,
        ]}
        onPress={() => onSelectAlphabet(item.id)}
        activeOpacity={0.82}
      >
        <View style={[styles.colorBar, { backgroundColor: item.color }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.cardTitles}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardNative}>{item.nativeName}</Text>
            </View>
            <View style={[styles.countBadge, { backgroundColor: item.color + '22' }]}> 
              <Text style={[styles.countText, { color: item.color }]}> 
                {item.letters.length}
              </Text>
            </View>
          </View>
          <Text style={styles.sampleChars} numberOfLines={1}>
            {sample}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />
      <View style={styles.backgroundGlow} pointerEvents="none">
        <View style={styles.heroCircle} />
        <View style={[styles.heroCircle, styles.heroCircleSmall]} />
      </View>
      <Animated.View >
        <Text style={styles.title}>Alphabet Learn</Text>
        <Text style={styles.subtitle}>Choose a script to study</Text>
      </Animated.View>
      <FlatList
        data={ALPHABET_LIST}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#080913',
  },
  backgroundGlow: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  heroCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#5b8cff33',
    position: 'absolute',
    top: -60,
    right: -80,
  },
  heroCircleSmall: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#d457ff22',
    top: 90,
    right: -40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f8f9ff',
    letterSpacing: -1,
    textShadowColor: '#5b8cff55',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  subtitle: {
    fontSize: 16,
    color: '#9da7ff',
    marginTop: 8,
    letterSpacing: 0.6,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#111428',
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 6,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  cardOffset: {
    transform: [{ translateX: -4 }],
  },
  colorBar: {
    width: 6,
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
  },
  cardBody: {
    flex: 1,
    padding: 22,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flag: {
    fontSize: 28,
  },
  cardTitles: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  cardNative: {
    fontSize: 12,
    color: '#9aa1cc',
    marginTop: 2,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sampleChars: {
    fontSize: 22,
    color: '#dfe5ff',
    letterSpacing: 1.7,
    fontWeight: '400',
  },
  description: {
    fontSize: 12,
    color: '#7c86c1',
    letterSpacing: 0.4,
    lineHeight: 18,
    maxWidth: '90%',
  },
});
