import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranscriptionContextType {
  transcriptionsEnabled: boolean;
  toggleTranscriptions: () => void;
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

const STORAGE_KEY = '@echo_transcriptions_enabled';

export function TranscriptionProvider({ children }: { children: ReactNode }) {
  const [transcriptionsEnabled, setTranscriptionsEnabled] = useState(true);

  // Load saved preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setTranscriptionsEnabled(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading transcription preference:', error);
      }
    };

    loadPreference();
  }, []);

  // Save preference whenever it changes
  useEffect(() => {
    const savePreference = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptionsEnabled));
      } catch (error) {
        console.error('Error saving transcription preference:', error);
      }
    };

    savePreference();
  }, [transcriptionsEnabled]);

  const toggleTranscriptions = () => {
    setTranscriptionsEnabled(prev => !prev);
  };

  return (
    <TranscriptionContext.Provider value={{ transcriptionsEnabled, toggleTranscriptions }}>
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