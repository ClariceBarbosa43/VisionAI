import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { imageToBase64 } from "../lib/gemini";

export default function PreviewScreen() {
  const params = useLocalSearchParams();

  const photoUri =
    typeof params.photoUri === "string"
      ? params.photoUri
      : "";

  async function handleAnalyze(promptKey) {
    try {
      if (!photoUri) {
        console.log("No photo found");
        return;
      }

      const base64Image =
        await imageToBase64(photoUri);

      console.log(
        "Base64 Length:",
        base64Image.length
      );

     router.push({
  pathname:"/result",
  params:{
    base64Image,
    photoUri,
    promptKey
  }
})

    } catch (error) {
      console.log(
        "Analyze Error:",
        error
      );
    }
  }

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
      />

      <View style={styles.bottomPanel}>

        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            Retake
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>
          Select Analysis:
        </Text>

        <View style={styles.personaRow}>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={() =>
              handleAnalyze("academic")
            }
          >
            <Text style={styles.buttonText}>
              Academic
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={() =>
              handleAnalyze("safety")
            }
          >
            <Text style={styles.buttonText}>
              Safety
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={() =>
              handleAnalyze("inventory")
            }
          >
            <Text style={styles.buttonText}>
              Inventory
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  preview: {
    flex: 1,
    resizeMode: "contain",
  },

  bottomPanel: {
    backgroundColor: "#111",
    padding: 20,
  },

  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "600",
  },

  personaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  retakeButton: {
    backgroundColor: "#5A6472",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: "center",
  },

  analyzeButton: {
    backgroundColor: "#5B3FA3",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});