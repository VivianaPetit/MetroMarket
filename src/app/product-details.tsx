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
        source={{ uri: product.fotos?.[0] || 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg' }} 
        style={styles.productImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle}>Nombre del producto:</Text>
        <Text style={styles.productTitle2}>{product.titulo}</Text>
        <Text style={styles.productDescription}>Descripcion: {product.descripcion}</Text>
        
        <Text style={styles.productPrice}>Precio: ${product.precio}</Text>
        <Text style={styles.productPrice}>Cantidad: {product.cantidad}</Text>
        <Text style={styles.productPrice}>Categoria:</Text>
        <Text style={styles.productCategory}>{product.categoria}</Text>
        <Text style={styles.productPrice}>Estado:</Text>
        <Text style={styles.productCategory}>{product.estado}</Text>
        <Text style={styles.productPrice}>Metodo de Pago:</Text>
        <Text style={styles.productmetodo}>{product.metodoPago}</Text>
        
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
  productTitle2: {
    fontSize: 24,
    marginBottom: 10,
  },
  productmetodo: {
    fontSize: 18,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,/* 
    color: '#00318D', */
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productCategory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    height: 30,
    width:98,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 12,
    color: '#333',
    marginBottom: 10,
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