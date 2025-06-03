import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Publicacion } from '../interfaces/types';
import { fetchPublicaciones } from '../services/publicacionService';

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // 1. Obtener TODAS las publicaciones usando tu función existente
        const publicaciones = await fetchPublicaciones();
        
        // 2. Buscar la publicación específica por ID
        const publicacionEncontrada = publicaciones.find(
          (pub) => pub._id === productId
        );

        if (!publicacionEncontrada) {
          throw new Error('El producto no existe o fue eliminado');
        }

        setProduct(publicacionEncontrada);
      } catch (err) {
        console.error('Error al cargar el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00318D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: product.fotos?.[0] || 'https://via.placeholder.com/300' }} 
        style={styles.productImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle}>Nombre del producto: {product.titulo}</Text>
        <Text style={styles.productDescription}>Descripcion: {product.descripcion}</Text>
        <Text style={styles.productPrice}>Precio: ${product.precio}</Text>
        <Text style={styles.productPrice}>Cantidad: {product.precio}</Text>
        <Text style={styles.productCategory}>Categoria: {product.categoria}</Text>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: '#00318D',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});