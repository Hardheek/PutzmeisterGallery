import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DetailsScreen = ({ route }) => {
  const { image } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);

  const shareImage = async () => {
    try {
      await Share.share({
        message: `Check out this image: ${image.url}`,
        url: image.url
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image source={{ uri: image.url }} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.title}>{image.title || 'Untitled'}</Text>
      <Text style={styles.author}>By: {image.creator || 'Unknown'}</Text>
      <Text style={styles.description}>
        {image.description ? image.description : 'No description available'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={shareImage} style={styles.button}>
          <Ionicons name="share-social-outline" size={24} color="black" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: image.url }} style={styles.fullImage} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 18, backgroundColor: '#fff' },
  image: { width: '100%', height: 300, borderRadius: 8, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  author: { fontSize: 14, color: 'gray', marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 20, color: '#444' },
  buttonContainer: { flexDirection: 'row', marginTop: 20 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffff33', padding: 10, borderRadius: 5 },
  buttonText: { color: 'black', marginLeft: 8 },
  modalContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: '90%', height: '80%' },
  closeButton: { position: 'absolute', top: 40, right: 20, padding: 10 }
});

export default DetailsScreen;
