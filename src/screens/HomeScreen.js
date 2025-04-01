import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ['Construction', 'Machinery', 'Concrete Pumps', 'Cranes'];

const HomeScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('putzmeister');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('putzmeister');

  useEffect(() => {
    fetchImages();
    loadFavorites();
  }, [searchQuery]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const url = `https://api.openverse.engineering/v1/images/?q=${searchQuery}`;
      const response = await fetch(url);
      const data = await response.json();
      setImages(data.results || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = useCallback(async (imageUrl) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(imageUrl)) {
        newFavorites.delete(imageUrl);
      } else {
        newFavorites.add(imageUrl);
      }
      AsyncStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { image: item })}>
      <View style={styles.card}>
        <Image source={{ uri: item.url }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.url)}>
          <Text style={styles.favoriteButton}>
            {favorites.has(item.url) ? '★' : '☆'} Favorite
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [favorites, toggleFavorite]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search images..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => {
              setSelectedCategory(category);
              setSearchQuery(category);
            }}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent} 
          initialNumToRender={6} 
          maxToRenderPerBatch={10} 
          windowSize={5} 
          removeClippedSubviews 
          getItemLayout={(data, index) => ({
            length: 220,
            offset: 220 * index,
            index
          })}
          ListEmptyComponent={<Text style={styles.emptyText}>No images found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  searchInput: { marginBottom: 10, padding: 8, borderWidth: 2, borderRadius: 5, borderColor: '#ccc' },
  categoryScroll: { marginBottom: 10 },
  categoryButton: {
    justifyContent: 'center', 
    paddingHorizontal: 16, 
    backgroundColor: '#eee', 
    borderRadius: 20, 
    marginRight: 10,
    marginBottom: 15,
    height: 40 
  },
  selectedCategory: { backgroundColor: '#ffff33' },
  categoryText: { fontSize: 14, color: '#333' },
  selectedCategoryText: { color: '#000', fontWeight: 'bold' },
  card: {  
    marginBottom: 10, 
    backgroundColor: '#ffff33', 
    padding: 10, 
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2 
  },
  image: { width: '100%', height: 200, borderRadius: 5 },
  title: { marginTop: 5, fontSize: 16, fontWeight: 'bold' },
  favoriteButton: { marginTop: 5, color: 'red', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
  loaderContainer: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20, 
  }
});

export default HomeScreen;
