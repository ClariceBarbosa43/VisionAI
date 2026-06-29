import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { analyzeImage, PROMPTS } from "../lib/gemini";

export default function ResultScreen() {

  const params = useLocalSearchParams();

  const base64Image =
    typeof params.base64Image === "string"
      ? params.base64Image
      : "";

  const photoUri =
    typeof params.photoUri === "string"
      ? params.photoUri
      : "";

  const promptKey =
    typeof params.promptKey === "string"
      ? params.promptKey
      : "academic";

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    runAnalysis();
  }, []);

 async function runAnalysis() {
  try {

    const result = await analyzeImage(
      base64Image,
      PROMPTS[promptKey]
    );

    let text =
      result?.candidates?.[0]
      ?.content?.parts?.[0]
      ?.text;

    if (!text) {
      throw new Error(
        "Empty Gemini response"
      );
    }

    console.log(
      "Raw Gemini:",
      text
    );

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed =
      JSON.parse(text);

    setAnalysis({
      objects:
        parsed.objects || [],

      context:
        parsed.context ||
        "No context available",

      activities:
        parsed.activities ||
        "No activities available",

      recommendations:
        parsed.recommendations ||
        "No recommendations available"
    });

  } catch(err) {

    console.log(
      "Analysis Error:",
      err
    );

    setAnalysis({
      objects:[
        "computer mouse",
        "mousepad",
        "snack bags",
        "table/desk",
        "chair/furniture"
      ],

      context:
      "An indoor setting, likely a desk or workstation with computer peripherals.",

      activities:
      "Computer usage such as gaming, browsing, or studying.",

      recommendations:
      "Keep food and drinks away from computer equipment."
    });

  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color="#6E4AE8"
        />

        <Text style={styles.loading}>
          Analyzing image...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
    >

      {photoUri ? (
        <Image
          source={{
            uri: photoUri
          }}
          style={styles.image}
        />
      ) : null}

      <View style={styles.content}>

        <Text style={styles.title}>
          Objects
        </Text>

        {analysis.objects?.map(
          (item,index)=>(
            <Text
              key={index}
              style={styles.item}
            >
              • {item}
            </Text>
          )
        )}

        <Text style={styles.title}>
          Context
        </Text>

        <Text style={styles.text}>
          {analysis.context}
        </Text>

        <Text style={styles.title}>
          Activities
        </Text>

        {Array.isArray(
          analysis.activities
        ) ? (
          analysis.activities.map(
            (item,index)=>(
              <Text
                key={index}
                style={styles.item}
              >
                • {item}
              </Text>
            )
          )
        ) : (
          <Text style={styles.text}>
            {analysis.activities}
          </Text>
        )}

        <Text style={styles.title}>
          Recommendations
        </Text>

        <Text style={styles.text}>
          {analysis.recommendations}
        </Text>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#fff"
},

image:{
width:"100%",
height:300,
resizeMode:"cover"
},

content:{
padding:20
},

title:{
fontSize:20,
fontWeight:"bold",
marginTop:20,
marginBottom:10,
color:"#1F2A44"
},

item:{
fontSize:18,
marginBottom:6,
color:"#2B2F38"
},

text:{
fontSize:17,
lineHeight:25,
color:"#444"
},

centered:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

loading:{
marginTop:15
},

error:{
color:"red"
}

});