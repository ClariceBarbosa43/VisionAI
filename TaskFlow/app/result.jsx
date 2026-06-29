import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';

export default function ResultScreen() {
  const { photoUri } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Analysis Result
      </Text>

      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
        />
      ) : (
        <Text style={styles.error}>
          No image received
        </Text>
      )}

      <Text style={styles.message}>
        AI analysis will be added in Phase 5
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
  },

  error: {
    fontSize: 16,
    marginBottom: 20,
  },
});