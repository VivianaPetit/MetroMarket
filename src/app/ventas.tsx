// archivo: MisVentasScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Button, Modal, TextInput, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/userContext';
import { fetchTransaccionById, confirmarEntrega } from '../services/transaccionService';
import { fetchPublicacionById } from '../services/publicacionService';
import { Transaccions, Publicacion } from '../interfaces/types';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TransaccionConPublicacion extends Transaccions {
  publicacionDetalle?: Publicacion;
}

const MisVentasScreen = () => {
  const { user } = useAuth();
  const [transacciones, setTransacciones] = useState<TransaccionConPublicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user?.transacciones?.length) {
      setLoading(false);
      return;
    }

    const cargarDetalles = async () => {
      try {
        const detalles = await Promise.all(
          user.transacciones.map((id) => fetchTransaccionById(id))
        );

        const soloVentas = detalles.filter(t => t.vendedor === user._id);

        const transaccionesConPublicacion = await Promise.all(
          soloVentas.map(async (trans) => {
            const publicacionDetalle = await fetchPublicacionById(trans.publicacion);
            return { ...trans, publicacionDetalle };
          })
        );

        setTransacciones(transaccionesConPublicacion);
      } catch (error) {
        console.error('Error al cargar transacciones o publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalles();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Ionicons name="person-circle-outline" size={64} color="#ccc" />
        <Text style={styles.title}>No has iniciado sesión</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F68628" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/menu')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#00318D" />
        </TouchableOpacity> 
        <Text style={styles.title}>Mis Ventas</Text>
      </SafeAreaView>
      <Ionicons name="cash-outline" size={64} color="#28A745" style={styles.icon} />

      {transacciones.length === 0 ? (
        <Text style={styles.emptyMessage}>No tienes ventas aún.</Text>
      ) : (
        transacciones
          .filter((trans): trans is TransaccionConPublicacion & { publicacionDetalle: Publicacion } => !!trans.publicacionDetalle)
          .map((trans) => (
            <View key={trans._id} style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: trans.publicacionDetalle.fotos[0] }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.titulo}>{trans.publicacionDetalle.titulo}</Text>
                  <Text style={styles.descripcion}>{trans.publicacionDetalle.descripcion}</Text>
                  <Text style={styles.precio}>${trans.publicacionDetalle.precio}</Text>
                  <Text style={styles.estado}>Estado: {trans.estado.toUpperCase()}</Text>
                  <Text style={styles.fecha}>
                    {new Date(trans.fecha).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          ))
      )}
    </ScrollView>
  );
};

export default MisVentasScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card horizontal
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  backButton: {
    marginRight: 10,
    paddingBottom: 20,
  },
    image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  descripcion: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  precio: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F68628',
    marginBottom: 2,
  },
  estado: {
    fontSize: 13,
    color: '#007B7F',
    marginBottom: 2,
  },
  fecha: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#F68628',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // Modal de reseña
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  textInput: {
    height: 90,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
