import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchImages();
    loadFavorites();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1');
      const data = await response.json();
      setImages(data.items);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (image) => {
    const updatedFavorites = favorites.includes(image.link)
      ? favorites.filter((fav) => fav !== image.link)
      : [...favorites, image.link];

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredImages = images.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search images..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', { image: item })}>
            <View style={styles.card}>
              <FastImage source={{ uri: item.media.m }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Text style={styles.favoriteButton}>
                  {favorites.includes(item.link) ? '★' : '☆'} Favorite
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  searchInput: { marginBottom: 10, padding: 8, borderWidth: 1, borderRadius: 5, borderColor: '#ccc' },
  card: { marginBottom: 10, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5 },
  image: { width: '100%', height: 200, borderRadius: 5 },
  title: { marginTop: 5, fontSize: 16, fontWeight: 'bold' },
  favoriteButton: { marginTop: 5, color: 'blue', fontWeight: 'bold' }
});

export default HomeScreen;