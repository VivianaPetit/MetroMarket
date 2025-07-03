import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/userContext';
import { fetchTransaccionById, confirmarEntrega, tieneMensajesNoLeidos } from '../services/transaccionService'; // <-- cambio aquí
import { fetchPublicacionById } from '../services/publicacionService';
import { fetchUsuarioById } from '../services/usuarioService';
import { Transaccions, Publicacion, Resena } from '../interfaces/types';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createResena } from '../services/ResenaServices';

interface TransaccionConPublicacion extends Transaccions {
  monto: number,
  publicacionDetalle?: Publicacion;
  vendedorDetalle?: {
    nombre: string;
    telefono: string;
  };
}

const MisComprasScreen = () => {
  const { user } = useAuth();
  const [transacciones, setTransacciones] = useState<TransaccionConPublicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaccion, setSelectedTransaccion] = useState<TransaccionConPublicacion | null>(null);
  const [comentario, setComentario] = useState('');
  const router = useRouter();
  const [Rating, setRating] = useState(0);
  const fecha = new Date();
  const [tarjetaExpandida, setTarjetaExpandida] = useState<string | null>(null);
  const [transaccionesConMensajesNoLeidos, setTransaccionesConMensajesNoLeidos] = useState<string[]>([]); // <-- cambio aquí

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

        const soloCompras = detalles.filter(t => t.comprador === user._id);

        const transaccionesConPublicacion = await Promise.all(
          soloCompras.map(async (trans) => {
            const publicacionDetalle = await fetchPublicacionById(trans.publicacion);
            const vendedorUsuario = await fetchUsuarioById(trans.vendedor);

            const vendedorDetalle = {
              nombre: vendedorUsuario.nombre,
              telefono: vendedorUsuario.telefono,
            };

            return { ...trans, publicacionDetalle, vendedorDetalle };
          })
        );

        setTransacciones(transaccionesConPublicacion);

        // 🔴 NUEVO: Verificar mensajes no leídos
        const idsConNoLeidos = await Promise.all(
          transaccionesConPublicacion.map(async (trans) => {
            const hayNoLeidos = await tieneMensajesNoLeidos(trans._id, user._id);
            return hayNoLeidos ? trans._id : null;
          })
        );
        setTransaccionesConMensajesNoLeidos(idsConNoLeidos.filter(Boolean) as string[]);

      } catch (error) {
        console.error('Error al cargar transacciones o publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalles();
  }, [user]);

  const handleCompletarCompra = (trans: TransaccionConPublicacion) => {
    setSelectedTransaccion(trans);
    setModalVisible(true);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleContactarVendedor = (transaccionId: string) => {
    if (!transaccionId) {
      alert('Transacción no identificada');
      return;
    }
    router.push({
      pathname: '/chat',
      params: { transaccionId },
    });
  };

  const enviarReseñaYConfirmar = async () => {
    if (!selectedTransaccion || !user) return;
    try {
      const newResena: Omit<Resena, '_id'> = {
        usuario: user._id,
        resenado: selectedTransaccion.vendedor || 'Vendedor desconocido',
        comentario,
        fecha,
        calificacion: Rating,
      };

      await createResena(newResena);
      await confirmarEntrega(selectedTransaccion._id, false);

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
      setRating(0);
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
        <Text style={styles.title}>Mis Compras</Text>
      </SafeAreaView>

      <Ionicons name="cart-outline" size={64} color="#F68628" style={styles.icon} />

      {transacciones
        .filter((trans): trans is TransaccionConPublicacion & { publicacionDetalle: Publicacion } => !!trans.publicacionDetalle)
        .map((trans) => {
          const estaExpandida = tarjetaExpandida === trans._id;

          return (
            <View key={trans._id} style={styles.card}>
              <TouchableOpacity onPress={() => setTarjetaExpandida(estaExpandida ? null : trans._id)}>
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: trans.publicacionDetalle.fotos?.[0] || 'https://via.placeholder.com/100' }}
                    style={styles.image}
                  />
                  <View style={styles.cardText}>
                    <Text style={styles.titulo}>{trans.publicacionDetalle.titulo}</Text>
                    <Text style={styles.precio}>${trans.monto.toLocaleString()}</Text>
                    <View
                      style={[
                        styles.estadoTag,
                        trans.estado === 'completado'
                          ? styles.estadoCompletado
                          : trans.estado === 'pendiente'
                          ? styles.estadoPendiente
                          : styles.estadoEnProceso,
                      ]}
                    >
                      <Text style={styles.estadoTexto}>{trans.estado.toUpperCase()}</Text>
                    </View>
                  </View>

                  {transaccionesConMensajesNoLeidos.includes(trans._id) && (
                    <View style={styles.redDot} />
                  )}

                  <Ionicons
                    name={estaExpandida ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={20}
                    color="#666"
                    style={{ marginLeft: 'auto' }}
                  />
                </View>
              </TouchableOpacity>

              {estaExpandida && (
                <View style={styles.cardExpanded}>
                  <Text style={styles.descripcion}>👤 {trans.vendedorDetalle?.nombre}</Text>
                  <Text style={styles.descripcion}>📞 {trans.vendedorDetalle?.telefono}</Text>

                  {trans.entregado[0] ? (
                    <Text style={styles.entregadoText}>Producto entregado ✅</Text>
                  ) : (
                    <View style={styles.buttonsRow}>
                      <TouchableOpacity
                        style={[styles.button, styles.buttonSecondary]}
                        onPress={() => handleContactarVendedor(trans._id)}
                      >
                        <Text style={styles.buttonText}>Contactar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleCompletarCompra(trans)}
                      >
                        <Text style={styles.buttonText}>Completar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.ratingSection}>
              <Text style={styles.ratingTitle}>Califica tu experiencia</Text>
              <Text style={styles.ratingSubtitle}>¿Cómo fue la experiencia con el vendedor?</Text>
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

export default MisComprasScreen;

const styles = StyleSheet.create({
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cardExpanded: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    gap: 6,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  icon: {
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  descripcion: {
    color: '#666',
    fontSize: 13,
    marginBottom: 1,
  },
  precio: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F68628',
    marginBottom: 4,
  },
  estadoTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  estadoCompletado: {
    backgroundColor: '#28a745',
  },
  estadoPendiente: {
    backgroundColor: '#ffc107',
  },
  estadoEnProceso: {
    backgroundColor: '#17a2b8',
  },
  entregadoText: {
    marginTop: 6,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#F68628',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    minWidth: '48%',
  },
  buttonSecondary: {
    backgroundColor: '#00318D',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
});
