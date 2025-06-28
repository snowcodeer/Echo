import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { spacing } from '@/styles/globalStyles';

export default function BoltBadge() {
  const handlePress = () => {
    Linking.openURL('https://bolt.new');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Image 
          source={require('@/assets/images/image.png')}
          style={styles.badgeImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Position above the tab bar
    right: spacing.xl,
    zIndex: 1000,
  },
  badgeImage: {
    width: 60,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});