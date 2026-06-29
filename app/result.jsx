import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import { PERSONAS } from './preview';

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

async function analyzeImageWithGemini(imageUri, prompt) {
  const base64Image = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const body = {
    contents: [{
      parts: [
        { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
        { text: prompt },
      ],
    }],
  };

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response text returned from Gemini.');
  return text;
}

function parseSections(raw) {
  const sections = { Objects: '', Context: '', Recommendations: '', Mood: '' };
  const keys = Object.keys(sections);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const startToken = `${key}:`;
    const start = raw.indexOf(startToken);
    if (start === -1) continue;
    const contentStart = start + startToken.length;
    const end = nextKey ? raw.indexOf(`${nextKey}:`, contentStart) : raw.length;
    sections[key] = raw.slice(contentStart, end === -1 ? raw.length : end).trim();
  }
  return sections;
}

const PERSONA_CONFIG = {
  student:      { label: '🎓 Student Analysis',      color: '#1a3a6e' },
  professional: { label: '💼 Professional Analysis', color: '#2d4a1e' },
  creative:     { label: '🎨 Creative Analysis',     color: '#4a1e4a' },
};

export default function ResultScreen() {
  const { photoUri, persona } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState(null);

  useEffect(() => {
    async function runAnalysis() {
      try {
        setLoading(true);
        setError(null);
        const prompt = PERSONAS[persona] ?? PERSONAS.student;
        const raw = await analyzeImageWithGemini(photoUri, prompt);
        setSections(parseSections(raw));
      } catch (err) {
        setError('Could not analyze the image. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    runAnalysis();
  }, [photoUri, persona]);

  const config = PERSONA_CONFIG[persona] ?? PERSONA_CONFIG.student;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.badge, { backgroundColor: config.color }]}>
        <Text style={styles.badgeText}>{config.label}</Text>
      </View>

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.image} />
      ) : null}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#5B3FA3" />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && sections && (
        <View style={styles.results}>
          {['Objects', 'Context', 'Recommendations', 'Mood'].map((key) => (
            <View key={key} style={styles.section}>
              <Text style={styles.sectionTitle}>{key}:</Text>
              <Text style={styles.sectionBody}>{sections[key]}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  badge: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginBottom: 16, alignSelf: 'center' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 20, resizeMode: 'cover' },
  loadingBox: { alignItems: 'center', gap: 12, marginTop: 24 },
  loadingText: { fontSize: 16, color: '#555' },
  errorBox: { alignItems: 'center', backgroundColor: '#fff0f0', borderRadius: 12, padding: 20, marginTop: 16, gap: 8, width: '100%' },
  errorIcon: { fontSize: 32 },
  errorText: { fontSize: 15, color: '#c0392b', textAlign: 'center', lineHeight: 22 },
  results: { width: '100%', gap: 16 },
  section: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: '#5B3FA3' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#5B3FA3', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBody: { fontSize: 15, color: '#333', lineHeight: 22 },
});