import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Image } from 'react-native'; // No olvides importar Image
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../context/userContext';
import { getMensajesByTransaccion, crearMensaje } from '../services/mensajeService';
import { fetchTransaccionById } from '../services/transaccionService';
import { fetchUsuarioById } from '../services/usuarioService';
import { fetchPublicacionById } from '../services/publicacionService';
import { Mensaje, Transaccions, Usuario, Publicacion } from '../interfaces/types';

const ChatScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const transaccionId = params.transaccionId as string;

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [transaccion, setTransaccion] = useState<Transaccions | null>(null);
  const [vendedor, setVendedor] = useState<Usuario | null>(null);
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);

  const flatListRef = useRef<FlatList<Mensaje>>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const transaccionData = await fetchTransaccionById(transaccionId);
        const mensajesData = await getMensajesByTransaccion(transaccionId);
        const vendedorData = await fetchUsuarioById(transaccionData.vendedor);
        const publicacionData = await fetchPublicacionById(transaccionData.publicacion);

        setTransaccion(transaccionData);
        setMensajes(mensajesData);
        setVendedor(vendedorData);
        setPublicacion(publicacionData);

        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    if (transaccionId) cargarDatos();
  }, [transaccionId]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !user || !transaccion) return;

    const mensaje: Partial<Mensaje> = {
      usuario: user._id,
      tipo: transaccion.comprador === user._id ? 'Comprador' : 'Vendedor',
      mensaje: nuevoMensaje,
      fecha: new Date(),
    };

    try {
      const nuevo = await crearMensaje(mensaje, transaccionId);
      setMensajes((prev) => [...prev, nuevo]);
      setNuevoMensaje('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const renderItem = ({ item }: { item: Mensaje }) => {
    const esPropio =
  typeof item.usuario === 'string'
    ? item.usuario === user?._id
    : item.usuario?._id === user?._id;
    return (
      <View style={[styles.burbuja, esPropio ? styles.burbujaPropia : styles.burbujaAjena]}>
        <Text style={[styles.mensajeTexto, { color: esPropio ? '#fff' : '#000' }]}>{item.mensaje}</Text>
        <Text style={styles.hora}>
          {new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (!user || !transaccion || !publicacion || !vendedor) {
    return (
      <View style={[styles.contenedor, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Cargando chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* HEADER estilo MercadoLibre */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.nombre}>{vendedor.nombre}</Text>
          <Text style={styles.producto}>{publicacion.titulo}</Text>
        </View>

        {publicacion.fotos[0] && (
          <Image
            source={{ uri: publicacion.fotos[0] }}
            style={styles.imagenProducto}
            resizeMode="contain"
          />
        )}
      </View>

      {/* MENSAJES */}
      <FlatList
        data={mensajes}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ref={flatListRef}
        contentContainerStyle={styles.listaMensajes}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribí un mensaje..."
            value={nuevoMensaje}
            onChangeText={setNuevoMensaje}
            onSubmitEditing={enviarMensaje}
            multiline
          />
          <TouchableOpacity onPress={enviarMensaje} style={styles.botonEnviar}>
            <Text style={styles.textoBoton}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F68628',
    padding: 12,
    paddingTop: 16,
  },
  volver: {
    fontSize: 24,
    color: '#FFF',
    marginRight: 8,
    paddingHorizontal: 8,
  },
  headerInfo: {
    flex: 1,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
  producto: {
    fontSize: 14,
    color: '#FFF',
  },
  link: {
    fontSize: 13,
    color: '#0066CC',
    marginTop: 2,
  },
  listaMensajes: {
    padding: 10,
    paddingBottom: 60,
  },
  burbuja: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 4,
    borderRadius: 15,
  },
  burbujaPropia: {
    backgroundColor: '#F68628',
    alignSelf: 'flex-end',
  },
  imagenProducto: {
  width: 60,
  height: 60,
  borderRadius: 8,
  marginLeft: 8,
  alignSelf: 'center',
},
  burbujaAjena: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  mensajeTexto: {
    fontSize: 14,
  },
  hora: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
    color: '#FFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    maxHeight: 100,
  },
  botonEnviar: {
    marginLeft: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
