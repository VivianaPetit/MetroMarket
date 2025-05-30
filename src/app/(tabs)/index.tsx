import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const { width } = Dimensions.get('window');

const categories = [
  'Electrónica',
  'Moda',
  'Belleza',
  'Servicios',
  'Hogar',
  'Deportes',
];

const products = [
  { id: '1', name: 'Women Printed Kurta', price: 1500, image: 'https://picsum.photos/id/100/300/300' },
  { id: '2', name: 'Men Classic Shirt', price: 1200, image: 'https://picsum.photos/id/101/300/300' },
  { id: '3', name: 'Kids Denim Jeans', price: 800, image: 'https://picsum.photos/id/102/300/300' },
  { id: '4', name: 'Smartwatch XYZ', price: 3500, image: 'https://picsum.photos/id/103/300/300' },
  { id: '5', name: 'Wireless Headphones', price: 2200, image: 'https://picsum.photos/id/104/300/300' },
  { id: '6', name: 'Travel Backpack', price: 950, image: 'https://picsum.photos/id/105/300/300' },
  { id: '7', name: 'Coffee Maker', price: 1800, image: 'https://picsum.photos/id/106/300/300' },
  { id: '8', name: 'Yoga Mat', price: 600, image: 'https://picsum.photos/id/107/300/300' },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="menu" size={24} color="#00318D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          <Text style={{ color: '#00318D', fontWeight: 'bold' }}>Metro</Text>
          <Text style={{ color: '#FF8C00', fontWeight: 'bold' }}>Market</Text>
        </Text>
        {/* <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity> */}
      </SafeAreaView>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#bbb" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor="#bbb"
        />
      </View>

      {/* Categorías */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contenido principal (productos) */}
      <ScrollView contentContainerStyle={styles.productsGrid}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerIcon: {
    paddingLeft: 10,
    paddingBottom: 20,
    

  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 15,
    height: 45,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoriesWrapper: {
    marginTop: 12,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    margin: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 6,

  },
  categoryButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  productCard: {
    width: (width / 2) - 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 2,
    shadowColor: '#FF8C00',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
});
