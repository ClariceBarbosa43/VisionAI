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

export default function PreviewScreen() {
  const { photoUri } =
    useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: decodeURIComponent(photoUri)
        }}
        style={styles.preview}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.retake}
          onPress={() => router.back()}
        >
          <Text style={styles.text}>
            Retake
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analyze}
          onPress={() =>
            router.push('/result')
          }
        >
          <Text style={styles.text}>
            Analyze
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#000'
  },

  preview:{
    flex:1,
    resizeMode:'contain'
  },

  row:{
    flexDirection:'row',
    justifyContent:'space-around',
    padding:20
  },

  retake:{
    backgroundColor:'#666',
    padding:15,
    borderRadius:10
  },

  analyze:{
    backgroundColor:'#5B3FA3',
    padding:15,
    borderRadius:10
  },

  text:{
    color:'#fff',
    fontWeight:'bold'
  }
});