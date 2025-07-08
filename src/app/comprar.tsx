import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchPublicacionById } from '../services/publicacionService';
import { fetchUsuarioById, agregarTransaccionAUsuario } from '../services/usuarioService';
import { createTransaccion } from '../services/transaccionService';
import { useAuth } from '../context/userContext';
import { Publicacion, Usuario } from '../interfaces/types';
import * as Notifications from 'expo-notifications';
import AntDesign from '@expo/vector-icons/AntDesign';
import { updatePublicacion } from '../services/actualizarService'; // Asegúrate de importar deletePublicacion

// Configurar manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Comprar: React.FC = () => {
  const { user, refrescarUsuario } = useAuth();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [vendedor, setVendedor] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);

  // Parsear parámetros
  const { productId, cantidad: cantidadParam } = params as {
    productId?: string;
    cantidad?: string;
  };

  useEffect(() => {
    if (cantidadParam) {
      const cantidadNum = parseInt(cantidadParam, 10);
      if (!isNaN(cantidadNum) && publicacion?.tipo !== 'Producto') {
        setCantidad(cantidadNum);
      }if (!isNaN(cantidadNum) && publicacion?.tipo === 'Producto') {
        setCantidad(1);
      }
    }
  }, [cantidadParam]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (typeof productId !== 'string') return;
        const pub = await fetchPublicacionById(productId);
        setPublicacion(pub);
        if (pub.usuario) {
          const vendedorInfo = await fetchUsuarioById(pub.usuario);
          setVendedor(vendedorInfo);
        }
      } catch (e) {
        setError('No se pudo cargar la información del producto');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [productId]);

  // Función para enviar notificaciones push
  const sendPushNotification = async (
    expoPushToken: string,
    { title, body, data }: { title: string; body: string; data?: any }
  ) => {
    if (!expoPushToken) {
      console.warn('No hay token de notificación para el vendedor');
      return;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  };

  const handleConfirmarCompra = async () => {
    if (!user || !publicacion || !vendedor || publicacion.cantidad <= 0 && publicacion.tipo === 'Producto') return;
    setProcessing(true);
    
    try {
      const montoTotal = cantidad * publicacion.precio;
      
      const nuevaTransaccion = await createTransaccion({
        comprador: user._id,
        vendedor: vendedor._id,
        publicacion: publicacion._id,
        monto: montoTotal,
        cantidadComprada: cantidad,
        metodoPago: 'efectivo',
        estado: 'Pendiente',
        fecha: new Date(),
        entregado: [false, false],
        mensajes: []
      });
      
      if(publicacion.tipo === 'Producto'){
        await updatePublicacion(publicacion._id, {
          cantidad: publicacion.cantidad - cantidad ,
        });
      }

      await Promise.all([
        agregarTransaccionAUsuario(user._id, nuevaTransaccion._id),
        agregarTransaccionAUsuario(vendedor._id, nuevaTransaccion._id),
      ]);

      await refrescarUsuario();

      // Enviar notificación al vendedor
      if (vendedor.expoPushToken) {
        await sendPushNotification(vendedor.expoPushToken, {
          title: `Nueva ${publicacion.tipo === 'Producto' ? 'compra' :
                          publicacion.tipo === 'Servicio' ? 'reserva' :
                          'intercambio'
                        }`,
          body: `El usuario ${user.nombre} ha realizado una ${publicacion.tipo === 'Producto' ? 'compra' :
                                                              publicacion.tipo === 'Servicio' ? 'reserva' :
                                                              'intercambio'} de tu publicación "${publicacion.titulo}"`,
          data: { 
            publicacionId: publicacion._id,
            tipo: 'nueva-orden',
            transaccionId: nuevaTransaccion._id
          }
        });
      } else {
        console.warn('El vendedor no tiene token de notificación registrado');
      }

      router.push({
        pathname: '/Review_PostShoping',
        params: {
          productId: publicacion._id,
          productName: publicacion.titulo,
          productPrice: montoTotal.toString(),
          productPriceTasa: publicacion.precioTasa,
          productType: publicacion.tipo,
          sellerName: vendedor.nombre,
          sellerPhone: vendedor.telefono,
          purchaseDate: new Date().toLocaleDateString(), 
          transaccionId: nuevaTransaccion._id,
          cantidad: cantidad.toString(),
        },
      });
      
    } catch (err) {
      console.error('Error en la compra:', err);
      Alert.alert('Error', 'No se pudo completar la compra');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F68628" />
        <Text style={{ marginTop: 10 }}>Cargando producto...</Text>
      </View>
    );
  }

  if (error || !publicacion) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error || 'Producto no encontrado'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAlt}>
          <Text style={{ color: '#fff' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const montoTotal = cantidad * publicacion.precio;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#F68628" />
      </TouchableOpacity>

      <Text style={styles.header}>Revisa y confirma tu compra</Text>

      <View style={styles.section}>
        <Ionicons name="location-outline" size={24} color="#F68628" />
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Detalle de la entrega</Text>
          <Text style={styles.sectionText}>Entrega a acordar con el vendedor</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="cash-outline" size={24} color="#F68628" />
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Detalle del pago</Text>
          <Text style={styles.sectionText}>Pago a acordar con el vendedor</Text>
        </View>
      </View>

      <View style={styles.card}>
        {/* revisar */}
        <View style={publicacion.tipo === 'Samanes' ? { display: 'none' } : null}>
          <Image
            source={{ uri: publicacion.fotos?.[0] || 'https://via.placeholder.com/150' }}
            style={styles.image}
          />
        </View>
        {/* visualizacion de precio y precioTasa para Samanes */}

        <View style={publicacion.tipo !== 'Samanes' ? { display: 'none' } : null}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop:25, marginBottom:4}}>
            <Text style={{ fontSize: 25, fontWeight: 'bold'}}>🌳</Text>
            <Text style={styles.chip}>{publicacion.precio}</Text>     
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom:25}}>
            <Text style={styles.chip2}>{publicacion.formaMoneda}</Text> 
          </View>
          <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}> 
            <AntDesign name="retweet" size={50} color="#FF8C00"/>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop:25, marginBottom:25}}>
            <Text style={styles.chip}>{publicacion.precioTasa}</Text>
            <Text style={{ fontSize: 25, fontWeight: 'bold'}}>Bs</Text>          
          </View>
        </View>
        

        <View>
          <Text style={styles.productTitle}>{publicacion.titulo}</Text>
          {publicacion.tipo === 'Samanes' && (
            <Text style={styles.tasaText}>Tasa vendedor: {publicacion.precioTasa.toFixed(2)} Bs</Text>
          )}
          <View style={styles.separador} />
          <View style={styles.detailRow}>

            <Text style={styles.detailLabel}> 
              {publicacion.tipo === 'Samanes' ? 'Valor de venta' : 'Precio unitario'}
            </Text>
            <Text style={styles.detailValue}>${publicacion.precio.toFixed(2)}</Text>
          </View>
          

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {publicacion.tipo === 'Producto' ? 'Cantidad seleccionada' : 'Cantidad'}
            </Text>
            <Text style={styles.detailValue}>{cantidad}</Text>
          </View>

          <View style={styles.separador} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { fontWeight: 'bold' }]}>Monto total </Text>
            <Text style={[styles.detailValue, { fontWeight: 'bold', color: '#F68628' }]}>
              ${montoTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          publicacion.cantidad <= 0 && publicacion.tipo === 'Producto' || processing ? styles.confirmButtonDisabled : null,
        ]}
        disabled={publicacion.cantidad <= 0 && publicacion.tipo === 'Producto' || processing}
        onPress={handleConfirmarCompra}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>
            {publicacion.tipo === 'Producto' ? 'Confirmar compra' :
             publicacion.tipo === 'Servicio' ? 'Confirmar reserva' :
             'Confirmar intercambio'
             }</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 2,
  },
  backButtonAlt: {
    marginTop: 20,
    backgroundColor: '#F68628',
    padding: 10,
    borderRadius: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    textAlign: 'center',
    color: '#111',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionContent: {
    marginLeft: 10,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 15,
    color: '#555',
  },
  card: {
    padding: 20,
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  productTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 5,
  },
  confirmButton: {
    backgroundColor: '#F68628',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: '#aaa',
  },
  confirmText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  separador: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 4,
    borderRadius: 100,
    width: 150,
    padding: 12,
    fontSize: 19,
    textAlign: 'center',
  },  
  chip2: {
    backgroundColor: '#d5edfc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 15,
    fontWeight: '600',
    color: '#29a5f5',
    textTransform: 'capitalize',
  },
  tasaText: {
    fontSize: 12,
    color: '#FF8C00',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default Comprar;