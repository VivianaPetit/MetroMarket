import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';



const producto = {
  titulo: 'Audífonos Bluetooth',
  precio: 25,
  cantidad: 3,
  descripcion: 'Audífonos inalámbricos con cancelación de ruido, batería de larga duración y estuche de carga.',
  imagen: 'https://via.placeholder.com/400x300',
  vendedor: 'Juan Pérez',
};

const Comprar = () => {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: producto.imagen }} style={styles.imagenProducto} />

      {/* Botón de volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.contenido}>
        <View style={styles.header}>
          <Text style={styles.titulo}>{producto.titulo}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={28} color="#F68628" />
          </TouchableOpacity>
        </View>

        <Text style={styles.precio}>${producto.precio}</Text>
        <Text style={styles.stock}>Cantidad disponible: {producto.cantidad}</Text>

        <View style={styles.separador} />

        <Text style={styles.subtitulo}>Descripción</Text>
        <Text style={styles.descripcion}>{producto.descripcion}</Text>

        <View style={styles.separador} />

        <Text style={styles.subtitulo}>Vendedor</Text>
        <Text style={styles.vendedor}>{producto.vendedor}</Text>

        <TouchableOpacity style={styles.botonComprar}>
          <Text style={styles.botonComprarTexto}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Comprar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imagenProducto: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 16,
    padding: 6,
  },
  contenido: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  precio: {
    fontSize: 24,
    color: '#F68628',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  stock: {
    color: '#555',
    marginBottom: 10,
  },
  separador: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  descripcion: {
    color: '#444',
    lineHeight: 20,
  },
  vendedor: {
    color: '#333',
    fontStyle: 'italic',
  },
  botonComprar: {
    marginTop: 24,
    backgroundColor: '#F68628',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonComprarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
