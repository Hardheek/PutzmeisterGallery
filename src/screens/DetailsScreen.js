import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const DetailsScreen = ({ route }) => {
  const { image } = route.params;

  return (
    <View style={styles.container}>
      <FastImage source={{ uri: image.media.m }} style={styles.image} />
      <Text style={styles.title}>{image.title}</Text>
      <Text style={styles.author}>By: {image.author}</Text>
      <Text style={styles.description}>{image.description.replace(/<[^>]+>/g, '')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  image: { width: '100%', height: 300, borderRadius: 5 },
  title: { marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  author: { fontSize: 14, color: 'gray', marginVertical: 5 },
  description: { fontSize: 14, marginTop: 5 }
});

export default DetailsScreen;
