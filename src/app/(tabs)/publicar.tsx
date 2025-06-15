
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  Image, // <-- Agrega Image aquí
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Categoria } from '../../interfaces/types';
import { fetchCategorias } from '../../services/categoriaService';
import { crearPublicacion } from '../../services/publicacionService';
import { agregarPublicacionAUsuario } from '../../services/usuarioService'; // <-- IMPORTA ESTO
import { useAuth } from '../../context/userContext';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { v4 as uuid } from 'uuid'; // asegúrate de tener uuid instalado
import { supabase } from '../../../supabase';


const estados = ['Nuevo', 'Usado', 'Reparado'];

const CreatePublication = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { user, refrescarUsuario } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estado, setEstado] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);


useEffect(() => {
  fetchCategorias()
    .then(data => setCategorias(data))
    .catch(console.error);
}, []);

const handlePublicar = async () => {
  if (!user) {
    Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero.');
    router.push("/");
    return;
  }

  // Validaciones
  if (titulo.trim().length < 3 || titulo.length > 100) {
    Alert.alert('Error', 'El título debe tener entre 3 y 100 caracteres.');
    return;
  }

  if (descripcion.length > 500) {
    Alert.alert('Error', 'La descripción no debe superar los 500 caracteres.');
    return;
  }

  const precioNumerico = parseFloat(precio);
  if (isNaN(precioNumerico) || precioNumerico < 0) {
    Alert.alert('Error', 'El precio debe ser un número válido mayor o igual a 0.');
    return;
  }

  const cantidadNumerica = parseInt(cantidad);
  if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
    Alert.alert('Error', 'La cantidad debe ser un número válido mayor que 0.');
    return;
  }

  if (!categoria || categoria === "") {
    Alert.alert('Error', 'Debes seleccionar una categoría válida.');
    return;
  }

  // Si pasa todas las validaciones, continúa con la creación
  const resetForm = () => {
    setTitulo('');
    setDescripcion('');
    setPrecio('');
    setCantidad('');
    setEstado('');
    setLugarEntrega('');
    setMetodoPago('');
    setCategoria('');
  };

  const categoriaSeleccionada = categorias.find(c => c._id === categoria);

  const nuevaPublicacion = {
    titulo,
    descripcion,
    precio: precioNumerico,
    cantidad: cantidadNumerica.toString(),
    estado,
    lugarEntrega,
    metodoPago,
    categoria: categoriaSeleccionada?.nombre,
    usuario: user._id,
  };

  try {
    const publicacionCreada = await crearPublicacion(nuevaPublicacion);
    await agregarPublicacionAUsuario(user._id, publicacionCreada._id);
    await refrescarUsuario();
    Alert.alert('¡Éxito!', 'Tu publicación ha sido creada.');
    resetForm();
    navigation.goBack();
  } catch (error) {
    Alert.alert('Error', 'No se pudo crear la publicación.');
    console.error(error);
  }
};

const pickImageAndUpload = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (!result.canceled) {
    const file = result.assets[0];
    const uri = file.uri;
    setImageUri(uri);

    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('El archivo no existe');
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convertimos base64 a Uint8Array
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Generar nombre de archivo único
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.jpg`;

      const { data, error } = await supabase.storage
        .from('publicaciones')
        .upload(filename, bytes, {
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        Alert.alert('Error', 'No se pudo subir la imagen');
      } else {
        const publicUrl = supabase.storage
          .from('publicaciones')
          .getPublicUrl(filename).data.publicUrl;

        setImageUrl(publicUrl);
        Alert.alert('Imagen subida', 'Se subió correctamente la imagen.');
      }
    } catch (err) {
      console.error('Error al preparar la imagen:', err);
      Alert.alert('Error', 'No se pudo preparar la imagen.');
    }
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#00318D" />
      </TouchableOpacity>

      <Text style={styles.label}>Foto del producto</Text>
      <TouchableOpacity style={styles.botonPublicar} onPress={pickImageAndUpload}>
        <Ionicons name="image-outline" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 10 }} />
      )}

      <Text style={styles.titulo}>Crear Publicación</Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Bicicleta montañera"
        placeholderTextColor="#888"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Agrega detalles importantes..."
        placeholderTextColor="#888"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={styles.label}>Precio *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <Text style={styles.label}>Cantidad *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
      />

      <Text style={styles.label}>Estado</Text>
      <View style={styles.chipsContainer}>
        {estados.map((op) => (
          <TouchableOpacity
            key={op}
            style={[styles.chip, estado === op && styles.chipSelected]}
            onPress={() => setEstado(op)}
          >
            <Text style={[styles.chipText, estado === op && styles.chipTextSelected]}>
              {op}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Lugar de entrega</Text>
      <TextInput
        style={styles.input}
        value={lugarEntrega}
        onChangeText={setLugarEntrega}
      />

      <Text style={styles.label}>Método de pago</Text>
      <TextInput
        style={styles.input}
        value={metodoPago}
        onChangeText={setMetodoPago}
      />

    <Text style={styles.label}>Categoría *</Text>
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
        style={[
          Platform.OS === 'ios' ? styles.pickerIOS : styles.picker
        ]}
      >
        <Picker.Item key="pick" label="Selecciona una categoría" value="" />
        {categorias.map((cat) => (
          <Picker.Item key={cat._id} label={cat.nombre} value={cat._id} />
        ))}
      </Picker>
    </View>

      <TouchableOpacity style={styles.botonPublicar} onPress={handlePublicar}>
        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Publicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreatePublication;



const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00318D',
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 4,
  },
  chipSelected: {
    backgroundColor: '#FF8C00',
  },
  chipText: {
    color: '#FF8C00',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
    
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  pickerIOS: {
    height: 200,
    color: '#000',
  },
  botonPublicar: {
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#00318D',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
