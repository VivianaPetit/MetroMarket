// app/category.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import { fetchPublicaciones } from '../services/publicacionService';
import { Publicacion } from '../interfaces/types';

const { width } = Dimensions.get('window');

export default function CategoryPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryName = params.category as string;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchPublicaciones();
        const filtered = allProducts.filter(p => p.categoria === categoryName);
        setProducts(filtered);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName]);

  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.header}>
            <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.backButton}
            >
        <Ionicons name="arrow-back" size={24} color="#00318D" />
            </TouchableOpacity> 
            <Text style={styles.headerTitle}>
              <Text style={{ color: '#00318D', fontWeight: 'bold'}}>{categoryName}</Text>
            </Text>
            <TouchableOpacity>
              <Ionicons name="person-outline" size={24} color="#fff" />
            </TouchableOpacity>            
        </SafeAreaView>

        {/* Productos */}
        <ScrollView contentContainerStyle={styles.productsGrid}>
        {products.length > 0 ? (
            products.map((pub) => (          
            <View style={styles.productCardWrapper} key={pub._id}>
                <ProductCard
                name={pub.titulo}
                price={pub.precio}
                category={pub.categoria}
                tipo={pub.tipo}
                image={pub.fotos?.[0] ?? 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg'}
                onPress={() => router.push({
                pathname: "/productDetails",
                params: { productId: pub._id }
                })}
                />
            </View>
            ))
        ) : (
            <View style={styles.emptyContainer}>
                <Ionicons name="sad-outline" size={48} color="#7f8c8d" />
                <Text style={styles.emptyText}>No hay productos en esta categoría</Text>
            </View>
        )}
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
   backButton: {
    marginRight: 10,
    paddingBottom: 20,
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
    addButton: {
    marginTop: 20,
    backgroundColor: '#00318D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
      emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
      emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    paddingVertical: 16,
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 10, 
  },
      productCardWrapper: {
    width: '48%', // Ocupa casi la mitad del ancho (deja espacio para el margen)
    marginBottom: 16, // Espacio vertical entre cards
  },
  errorMensaje: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    textAlign: 'center', 
    width: '100%', 
    marginTop: 20,
  },

});