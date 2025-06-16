import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchPublicacionById } from '../services/publicacionService';
import { fetchUsuarioById } from '../services/usuarioService';
import { createTransaccion } from '../services/transaccionService';
import { agregarTransaccionAUsuario } from '../services/usuarioService';
import { useAuth } from '../context/userContext'; 
import { Publicacion, Usuario } from '../interfaces/types';

const Comprar: React.FC = () => {
  const { user } = useAuth();
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendedor, setVendedor] = useState<Usuario | null>(null);

  useEffect(() => {
    const cargarPublicacionYVendedor = async () => {
      try {
        if (typeof productId !== 'string') {
          setError('ID de producto inválido');
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
        setError('No se pudo cargar la información del producto');
      } finally {
        setLoading(false);
      }
    };

    cargarPublicacionYVendedor();
  }, [productId]);

  const handleConfirmarCompra = async () => {
    if (!user || !publicacion || !vendedor) return;
    if (publicacion.cantidad <= 0) return;

    setProcessing(true);
    
    try {
      // 1. Crear la transacción
      const nuevaTransaccion = await createTransaccion({
        comprador: user._id,
        vendedor: vendedor._id,
        publicacion: publicacion._id,
        monto: publicacion.precio,
        metodoPago: 'efectivo', 
        estado: 'Pendiente', 
        fecha: new Date(),
        entregado : [false, false],
      });

      // 2. Actualizar ambos usuarios
      await Promise.all([
        agregarTransaccionAUsuario(user._id, nuevaTransaccion._id),
        agregarTransaccionAUsuario(vendedor._id, nuevaTransaccion._id)
      ]);

      // 3. Navegar a la pantalla de confirmación
      router.push({
        pathname: '/Review_PostShoping',
        params: {
          productId: publicacion._id,
          productName: publicacion.titulo,
          productPrice: publicacion.precio.toString(),
          sellerName: vendedor.nombre,
          sellerPhone: vendedor.telefono,
          transaccionId: nuevaTransaccion._id,
          purchaseDate: new Date().toISOString()
        },
      });

    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la compra');
      console.error('Error en compra:', error);
    } finally {
      setProcessing(false);
    }
  };

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
          style={[
            styles.buyButton, 
            publicacion.cantidad <= 0 ? styles.buyButtonDisabled : null,
            processing ? styles.buyButtonProcessing : null
          ]}
          onPress={handleConfirmarCompra}
          disabled={publicacion.cantidad <= 0 || processing || !user}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyButtonText}>
              {publicacion.cantidad > 0 ? 'Confirmar compra' : 'Agotado'}
            </Text>
          )}
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
  buyButtonProcessing: {
    opacity: 0.7,
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