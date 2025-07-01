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
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Mensaje } from '../interfaces/types';
import {
  getMensajesByTransaccion,
  crearMensaje,
} from '../services/mensajeService';
import { agregarMensajeATransaccion } from '../services/transaccionService';
import { useAuth } from '../context/userContext'; // Ajusta ruta según tu estructura

const ChatScreen: React.FC = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const transaccionId = params.transaccionId as string;

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const flatListRef = useRef<FlatList<Mensaje>>(null);

  useEffect(() => {
    if (!transaccionId) return;

    const cargarMensajes = async () => {
      try {
        // Usamos el endpoint que ya devuelve mensajes completos
        const data = await getMensajesByTransaccion(transaccionId);
        setMensajes(data);
        // Scroll al final al cargar mensajes
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      }
    };

    cargarMensajes();
  }, [transaccionId]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !user) return;

    const mensaje: Partial<Mensaje> = {
      usuario: user._id,
      tipo: 'Comprador', // o 'Vendedor' según tu lógica
      mensaje: nuevoMensaje,
      fecha: new Date(),
    };

    try {
      // Crear mensaje
      const nuevo = await crearMensaje(mensaje, transaccionId);
      // Actualizar transacción agregando el mensaje
      setMensajes((prev) => [...prev, nuevo]);
      setNuevoMensaje('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const renderItem = ({ item }: { item: Mensaje }) => {
    // Comparar con _id del usuario (item.usuario es objeto)
    const esPropio = item?.usuario === user?._id;

    return (
      <View
        style={[
          styles.burbuja,
          esPropio ? styles.burbujaPropia : styles.burbujaAjena,
        ]}
      >
        <Text
          style={[
            styles.mensajeTexto,
            esPropio ? { color: '#fff' } : { color: '#000' },
          ]}
        >
          {item.mensaje}
        </Text>
        <Text style={styles.hora}>
          {new Date(item.fecha).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (!user) {
    return (
      <View
        style={[styles.contenedor, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <Text>Debes iniciar sesión para chatear</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.contenedor}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <FlatList
        data={mensajes}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ref={flatListRef}
        contentContainerStyle={styles.listaMensajes}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
          onSubmitEditing={enviarMensaje}
          multiline
          returnKeyType="send"
        />
        <TouchableOpacity onPress={enviarMensaje} style={styles.botonEnviar}>
          <Text style={styles.textoBoton}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listaMensajes: {
    padding: 10,
  },
  burbuja: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 4,
    borderRadius: 15,
  },
  burbujaPropia: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-end',
  },
  burbujaAjena: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  mensajeTexto: {
    // color asignado dinámicamente en renderItem
  },
  hora: {
    color: '#D1D5DB',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
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
