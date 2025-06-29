// archivo: MisVentasScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Button, Modal, TextInput, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/userContext';
import { fetchTransaccionById, confirmarEntrega } from '../services/transaccionService';
import { fetchPublicacionById } from '../services/publicacionService';
import { fetchUsuarioById } from '../services/usuarioService';
import { createResena } from '../services/ResenaServices';
import { Linking } from 'react-native';
import { Transaccions, Publicacion, Resena } from '../interfaces/types';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TransaccionConPublicacion extends Transaccions {
  monto: number; // Asegúrate de que monto esté presente y sea un número
  publicacionDetalle?: Publicacion;
  compradorDetalle?: {
    nombre: string;
    telefono: string;
  };
}

const MisVentasScreen = () => {
  const { user } = useAuth();
  const [transacciones, setTransacciones] = useState<TransaccionConPublicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [Rating, setRating] = useState(0);
  const [selectedTransaccion, setSelectedTransaccion] = useState<TransaccionConPublicacion | null>(null);
  const [comentario, setComentario] = useState('');
  const fecha = new Date();

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
            const compradorUsuario = await fetchUsuarioById(trans.comprador);

            const compradorDetalle = {
              nombre: compradorUsuario.nombre,
              telefono: compradorUsuario.telefono,
            };

            return { ...trans, publicacionDetalle, compradorDetalle };
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

  const abrirWhatsApp = (telefono: string) => {
  const numeroConPrefijo = telefono.startsWith('+') ? telefono : `+58${telefono}`; // Ajusta prefijo según país
  const url = `whatsapp://send?phone=${numeroConPrefijo}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        alert('Parece que WhatsApp no está instalado');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('Error al abrir WhatsApp:', err));
};

  const handleCompletarCompra = (trans: TransaccionConPublicacion) => {
    setSelectedTransaccion(trans);
    setModalVisible(true);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const enviarReseñaYConfirmar = async () => {
    if (!selectedTransaccion || !user) return;
    try {
      const newResena: Omit<Resena, '_id'> = {
        usuario: user._id,
        resenado: selectedTransaccion.comprador || 'comprador desconocido',
        comentario,
        fecha,
        calificacion: Rating,
      };

      await createResena(newResena);
      await confirmarEntrega(selectedTransaccion._id, true);

      let actualizada = await fetchTransaccionById(selectedTransaccion._id);
      if (actualizada.entregado[0] && actualizada.entregado[1] && actualizada.estado !== 'completado') {
        actualizada = { ...actualizada, estado: 'completado' };
      }

      const nuevaLista = transacciones.map(t =>
        t._id === actualizada._id ? { ...actualizada, publicacionDetalle: selectedTransaccion.publicacionDetalle } : t
      );

      setTransacciones(nuevaLista);
    } catch (error) {
      console.error('Error al confirmar entrega:', error);
    } finally {
      setModalVisible(false);
      setComentario('');
    }
  };

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
        <TouchableOpacity onPress={() => router.push('/menu')} style={styles.backButton}>
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
                  source={{ uri: trans.publicacionDetalle.fotos?.[0] || 'https://via.placeholder.com/110' }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.titulo}>{trans.publicacionDetalle.titulo}</Text>
                  <Text style={styles.precio}>Monto: ${trans.monto}</Text>
                  <Text style={styles.estado}>Estado: {trans.estado.toUpperCase()}</Text>
                  <Text style={styles.descripcion}>Comprador: {trans.compradorDetalle?.nombre}</Text>
                  <Text style={styles.descripcion}>Teléfono: {trans.compradorDetalle?.telefono}</Text>

                  {trans.entregado[1] ? (
                    <Text style={styles.entregadoText}>Producto entregado ✅</Text>
                  ) : (
                    <TouchableOpacity style={styles.button} onPress={() => handleCompletarCompra(trans)}>
                      <Text style={styles.buttonText}>Marcar como completada</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.ratingSection}>
              <Text style={styles.ratingTitle}>Califica tu experiencia</Text>
              <Text style={styles.ratingSubtitle}>¿Cómo fue la experiencia con el comprador?</Text>
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => handleRatingChange(i + 1)} style={styles.starButton}>
                    <Ionicons name={i < Rating ? 'star' : 'star-outline'} size={32} color="#F68628" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.commentLabel}>Deja un comentario:</Text>
            <TextInput
              editable
              multiline
              numberOfLines={10}
              maxLength={400}
              onChangeText={text => setComentario(text)}
              value={comentario}
              style={styles.textInput}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancelar" color="#888" onPress={() => setModalVisible(false)} />
              <Button title="Confirmar entrega" onPress={enviarReseñaYConfirmar} color="#F68628" />
            </View>
          </View>
        </View>
      </Modal>
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
  ratingSection: {
  marginBottom: 20,
  alignItems: 'center',
},
ratingTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
},
ratingSubtitle: {
  fontSize: 14,
  color: '#666',
  marginBottom: 12,
  textAlign: 'center',
},
starsRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 4,
},
starButton: {
  paddingHorizontal: 4,
},
commentLabel: {
  fontSize: 15,
  fontWeight: '500',
  color: '#444',
  marginBottom: 6,
  marginTop: 10,
},
  entregadoText: {
  marginTop: 6,
  color: 'green',
  fontWeight: 'bold',
  fontSize: 14,
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
