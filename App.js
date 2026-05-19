import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import LearnScreen from './src/screens/LearnScreen';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [alphabetId, setAlphabetId] = useState(null);

  const handleSelect = (id) => {
    setAlphabetId(id);
    setScreen('learn');
  };

  const handleBack = () => {
    setScreen('home');
    setAlphabetId(null);
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === 'home' ? (
        <HomeScreen onSelectAlphabet={handleSelect} />
      ) : (
        <LearnScreen alphabetId={alphabetId} onBack={handleBack} />
      )}
    </>
  );
}
