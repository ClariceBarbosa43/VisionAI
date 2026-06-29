import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

// ─── Persona Prompts ────────────────────────────────────────────────────────
// Prompt wording is a first-class design decision: the same image produces
// three very different analyses because each prompt tells the AI what to
// notice, what vocabulary to use, and what to recommend.
const PERSONAS = {
  student: `You are an academic study assistant. Analyze this image and respond
in exactly this format:

Objects:
• [list each visible object, one per bullet]

Context:
[One sentence describing the study or learning situation shown]

Recommendations:
[Two to three practical study tips based on what you see]

Mood:
[One word describing the energy or atmosphere]`,

  professional: `You are a productivity consultant. Analyze this image and respond
in exactly this format:

Objects:
• [list each visible item in the workspace, one per bullet]

Context:
[One sentence describing the work environment or task visible]

Recommendations:
[Two to three actionable productivity improvements based on what you see]

Mood:
[One word describing the workspace atmosphere]`,

  creative: `You are a creative director with an artistic eye. Analyze this image
and respond in exactly this format:

Objects:
• [list visible elements using evocative, descriptive language, one per bullet]

Context:
[One sentence interpreting the mood, story, or feeling of the scene]

Recommendations:
[Two to three creative ideas or inspirations sparked by what you see]

Mood:
[One word capturing the artistic essence of the image]`,
};

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams();

  function navigateToResult(persona) {
    router.push({
      pathname: '/result',
      params: {
        photoUri,
        persona,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
      />

      <View style={styles.bottomPanel}>

        {/* RETAKE */}
        <TouchableOpacity
          style={styles.retake}
          onPress={() => router.back()}
        >
          <Text style={styles.retakeText}>↩ Retake</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Analyze as:</Text>

        {/* PERSONA BUTTONS */}
        <View style={styles.personaRow}>

          <TouchableOpacity
            style={[styles.personaBtn, styles.student]}
            onPress={() => navigateToResult('student')}
          >
            <Text style={styles.personaIcon}>🎓</Text>
            <Text style={styles.personaText}>Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.personaBtn, styles.professional]}
            onPress={() => navigateToResult('professional')}
          >
            <Text style={styles.personaIcon}>💼</Text>
            <Text style={styles.personaText}>Professional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.personaBtn, styles.creative]}
            onPress={() => navigateToResult('creative')}
          >
            <Text style={styles.personaIcon}>🎨</Text>
            <Text style={styles.personaText}>Creative</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

// Export prompts so result.jsx can use them without touching this file
export { PERSONAS };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  preview: {
    flex: 1,
    resizeMode: 'contain',
  },

  bottomPanel: {
    backgroundColor: '#111',
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },

  retake: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },

  retakeText: {
    color: '#aaa',
    fontSize: 14,
  },

  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 4,
  },

  personaRow: {
    flexDirection: 'row',
    gap: 10,
  },

  personaBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },

  student: {
    backgroundColor: '#1a3a6e',
  },

  professional: {
    backgroundColor: '#2d4a1e',
  },

  creative: {
    backgroundColor: '#4a1e4a',
  },

  personaIcon: {
    fontSize: 24,
  },

  personaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});