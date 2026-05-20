import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import { ALPHABET_LIST } from '../data/alphabets';

const { width } = Dimensions.get('window');

const getNumColumns = () => {
  if (width < 600) return 2;
  if (width < 900) return 3;
  return 4;
};

export default function HomeScreen({ onSelectAlphabet }) {
  const [numColumns, setNumColumns] = useState(getNumColumns());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setNumColumns(getNumColumns());
    });
    return () => subscription?.remove();
  }, []);

  const filteredData = ALPHABET_LIST.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const sample = item.letters.slice(0, 3).map((l) => l.char).join(' ');
    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: item.color + '88', shadowColor: item.color }]}
        onPress={() => onSelectAlphabet(item.id)}
        activeOpacity={0.82}
      >
        <View style={[styles.colorBar, { backgroundColor: item.color }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={[styles.countBadge, { backgroundColor: item.color + '22' }]}>
              <Text style={[styles.countText, { color: item.color }]}>
                {item.letters.length}
              </Text>
            </View>
          </View>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardNative} numberOfLines={1}>
            {item.nativeName}
          </Text>
          <Text style={styles.sampleChars} numberOfLines={1}>
            {sample}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>Alphabet Learn</Text>
        <Text style={styles.subtitle}>Choose a script to study</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search languages..."
          placeholderTextColor="#7c86c1"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No languages found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8f9ff',
    letterSpacing: -0.5,
    textShadowColor: '#5b8cff55',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  subtitle: {
    fontSize: 14,
    color: '#9da7ff',
    marginTop: 6,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: '#111428',
    borderWidth: 1,
    borderColor: '#5b8cff44',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f8f9ff',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 40,
  },
  columnWrapper: {
    gap: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#111428',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 6,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    minHeight: 240,
  },
  colorBar: {
    height: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  flag: {
    fontSize: 24,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  cardNative: {
    fontSize: 11,
    color: '#9aa1cc',
  },
  sampleChars: {
    fontSize: 18,
    color: '#dfe5ff',
    letterSpacing: 1,
    fontWeight: '400',
    marginTop: 4,
  },
  description: {
    fontSize: 11,
    color: '#7c86c1',
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9da7ff',
  },
});
