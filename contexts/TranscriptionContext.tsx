import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranscriptionContextType {
  showTranscriptions: boolean;
  toggleTranscriptions: () => void;
  loading: boolean;
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

const STORAGE_KEY = '@echo_show_transcriptions';

export function TranscriptionProvider({ children }: { children: ReactNode }) {
  const [showTranscriptions, setShowTranscriptions] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load preference from storage on mount
  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setShowTranscriptions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading transcription preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTranscriptions = async () => {
    try {
      const newValue = !showTranscriptions;
      setShowTranscriptions(newValue);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving transcription preference:', error);
    }
  };

  return (
    <TranscriptionContext.Provider value={{
      showTranscriptions,
      toggleTranscriptions,
      loading,
    }}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscription() {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
}