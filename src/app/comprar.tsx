import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchPublicacionById } from '../services/publicacionService';
import { fetchUsuarioById } from '../services/usuarioService';
import { Publicacion, Usuario } from '../interfaces/types';
import { ErrorUtils } from 'react-native';


const Comprar: React.FC = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendedor, setVendedor] = useState<Usuario | null>(null);

  useEffect(() => {
    const cargarPublicacionYVendedor = async () => {
      try {
        if (typeof productId !== 'string') {
          // Si productId no es string (ej. undefined o array), maneja el error y termina.
          setError('ID de producto inválido. No se puede cargar la publicación.');
          setLoading(false);
          return;
        }
        
        const publicacionData = await fetchPublicacionById(productId);
        setPublicacion(publicacionData);
        
        if (publicacionData.usuario) {
          const usuarioData = await fetchUsuarioById(publicacionData.usuario);
          setVendedor(usuarioData);
        }
        
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudo cargar la información del producto. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    cargarPublicacionYVendedor();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F68628" />
        <Text style={{ marginTop: 10, color: '#555' }}>Cargando producto...</Text>
      </View>
    );
  }

  if (error || !publicacion) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="red" />
        <Text style={styles.errorText}>{error || 'Producto no encontrado.'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

const textoVendedor = (vendedor?.nombre && vendedor?.telefono)
  ? `${vendedor.nombre} - ${vendedor.telefono}`
  : 'Cargando información del vendedor...';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#F68628" />
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: publicacion.fotos?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
          }}
          style={styles.productImage}
          resizeMode="cover"
          onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.titleText}>{publicacion.titulo}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={28} color="#F68628" />
          </TouchableOpacity>
        </View>

        <Text style={styles.priceText}>
          {`$${typeof publicacion.precio === 'number' ? publicacion.precio.toFixed(2) : '0.00'}`}
        </Text>
        <Text style={styles.stock}>Cantidad disponible: {publicacion.cantidad}</Text>

        <View style={styles.separador} />

        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.descriptionText}>{publicacion.descripcion}</Text>

        <View style={styles.separador} />

        <Text style={styles.sectionLabel}>Vendedor</Text>
        <Text style={styles.detailText}>{textoVendedor}</Text>
        <TouchableOpacity 
          style={[styles.buyButton, publicacion.cantidad <= 0 ? styles.buyButtonDisabled : null]}
          onPress={() => {
            if ((publicacion && vendedor) && typeof productId === 'string' && publicacion.cantidad > 0) { // <-- Verificación adicional
              router.push({
                pathname: '/Review_PostShoping',
                params: {
                  productId: productId, // Aseguramos que productId es un string aquí
                  productName: publicacion.titulo,
                  productPrice: publicacion.precio.toFixed(2), 
                  sellerName: vendedor.nombre,
                  sellerPhone: vendedor.telefono,
                  purchaseDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
                },
              });
            }
          }}
          disabled={publicacion.cantidad <= 0}
        >
          <Text style={styles.buyButtonText}>
            {(parseInt(publicacion.cantidad ?? '0') > 0) ? 'Confirmar compra' : 'Agotado'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  imageWrapper: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 350,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    padding: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    color: '#111',
  },
  priceText: {
    fontSize: 24,
    color: '#F68628',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  stock: {
    color: '#555',
    marginBottom: 15,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 19,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  buyButton: {
    backgroundColor: '#F68628',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F68628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buyButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separador: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
});

export default Comprar;