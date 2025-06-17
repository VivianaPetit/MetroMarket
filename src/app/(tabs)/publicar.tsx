
import React, { useEffect, useState, } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Image, ActivityIndicator
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
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../../supabase';
import { useLocalSearchParams } from 'expo-router';


const estados = ['Nuevo', 'Usado', 'Reparado'];
const modalidades = ['Presencial', 'Asincrono', 'Híbrido'];
const metodoPagos = ['Efectivo', 'PagoMovil', 'Transferencia bancaria', 'Zelle', 'Paypal'];
//--------------------------------------------------------------------------------------------------------
//necesario para la seleccion de horario
const semanas = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

//--------------------------------------------------------------------------------------------------------------

const CreatePublication = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { user, refrescarUsuario } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estado, setEstado] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [loading, setLoading] = useState(false);

  const HORARIO_INICIAL = {
    lunes: ['false'],
    martes: ['false'],
    miercoles: ['false'],
    jueves: ['false'],
    viernes: ['false'],
    sabado: ['false'],
    domingo: ['false']
  };

  
  const [horario, setHorario] = useState<Record<string, string[]>>(HORARIO_INICIAL);
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);

  const [images, setImages] = useState<{ uri: string; base64: string }[]>([]); // guarda [{ uri, base64 }]
  interface FormErrors {
  titulo?: string;
  descripcion?: string;
  precio?: string;
  cantidad?: string;
  categoria?: string;
  metodoPago?: string;
  imagenes?: string;
}
const [errors, setErrors] = useState<FormErrors>({});

const validarFormulario = (): FormErrors => {
  const errores: FormErrors = {};

  if (titulo.trim().length < 3 || titulo.length > 100) {
    errores.titulo = 'El título debe tener entre 3 y 100 caracteres.';
  }

  if (descripcion.length > 500) {
    errores.descripcion = 'La descripción no debe superar los 500 caracteres.';
  }

  const precioNumerico = parseFloat(precio);
  if (isNaN(precioNumerico) || precioNumerico < 0) {
    errores.precio = 'El precio debe ser un número válido mayor o igual a 0.';
  }

  const cantidadNumerica = parseInt(cantidad);
  if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
    errores.cantidad = 'La cantidad debe ser un número válido mayor que 0.';
  }

  if (!categoria || categoria === '' || categoria === 'Selecciona una categoría') {
    errores.categoria = 'Debes seleccionar una categoría válida.';
  }

  if (horario === HORARIO_INICIAL && tipoPublicacion === 'servicio') {
    errores.metodoPago = 'Debes seleccionar al menos un dia de disponibilidad.';
  }

  if (!metodoPago || metodoPago === '' || metodoPago === 'Selecciona un método de pago') {
    errores.metodoPago = 'Debes seleccionar un método de pago válido.';
  }

  if (images.length === 0) {
    errores.imagenes = 'Debes seleccionar al menos una imagen.';
  }

  return errores;
};

useEffect(() => {
  fetchCategorias()
    .then(data => setCategorias(data))
    .catch(console.error);
}, []);

const handlePublicar = async () => {

    if (!user) {
    router.push('/login');
    return;
  }

  setLoading(true);

  const errores = validarFormulario();
  setErrors(errores);

  if (Object.keys(errores).length > 0) return;

  try {
    // 1. Subir imágenes a Supabase
    const urls = [];

    for (const image of images) {
      const binaryString = atob(image.base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.jpg`;

      const { error } = await supabase.storage
        .from('publicaciones')
        .upload(filename, bytes, {
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        Alert.alert('Error', 'No se pudo subir una imagen.');
        return;
      }

      const publicUrl = supabase.storage
        .from('publicaciones')
        .getPublicUrl(filename).data.publicUrl;

      urls.push(publicUrl);
    }

    // 2. Crear publicación en Mongo con links de las imágenes
    const categoriaSeleccionada = categorias.find(c => c._id === categoria);

    const nuevaPublicacion = {
      titulo,
      descripcion,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
      estado,
      lugarEntrega,
      metodoPago,
      tipo: tipoPublicacion,
      modalidad,
      horario,
      categoria: categoriaSeleccionada?.nombre,
      usuario: user._id,
      fotos: urls, // Aquí se guarda la lista de URLs de las imágenes
    };

    const publicacionCreada = await crearPublicacion(nuevaPublicacion);
    await agregarPublicacionAUsuario(user._id, publicacionCreada._id);
    await refrescarUsuario();

    

    // 3. Resetear formulario
    setTitulo('');
    setDescripcion('');
    setPrecio('');
    setCantidad('');
    setEstado('');
    setModalidad('');
    setLugarEntrega('');
    setMetodoPago('');
    setCategoria('');
    setImages([]);
    setHorario(HORARIO_INICIAL);

    setLoading(false);
    Alert.alert('¡Éxito!', 'Tu publicación ha sido creada.');
    navigation.goBack();

  } catch (error) {
    console.error('Error al publicar:', error);
    Alert.alert('Error', 'Ocurrió un error al publicar.');
  }

};

const pickImageAndStore = async () => {
  if (images.length >= 5) {
    Alert.alert('Límite de imágenes', 'Solo puedes subir hasta 5 imágenes por publicación.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (!result.canceled) {
    const file = result.assets[0];
    const uri = file.uri;

    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('El archivo no existe');
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const newImage = { uri, base64 };
      setImages((prev) => [...prev, newImage]);
    } catch (err) {
      console.error('Error al preparar la imagen:', err);
      Alert.alert('Error', 'No se pudo preparar la imagen.');
    }
  }
};

  const params = useLocalSearchParams();
  const tipoPublicacion = params.tipoPublicacion; // 'producto' o 'servicio'

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00318D" />
          <Text style={{ marginTop: 10, color: '#555' }}>Subiendo publicación...</Text>
        </View>
      );
    }
  
  return (

    <ScrollView contentContainerStyle={styles.container}>
      {/* parte para salir del formulario */}
      <TouchableOpacity onPress={() => router.push('/formularioPublicar')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#00318D" />
      </TouchableOpacity>
      {/* titulo de la pagina */}
      <Text style={styles.titulo}>Crear Publicación</Text>
      {/* para cargar imagenes */}
      <Text style={styles.label}>
        {tipoPublicacion === 'producto' ? 'Fotos del producto' : 'Fotos del servicio'}
      </Text>
      <TouchableOpacity style={styles.botonPublicar} onPress={pickImageAndStore}>
        <Ionicons name="image-outline" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <ScrollView horizontal style={{ marginTop: 10 }} showsHorizontalScrollIndicator={false}>
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.uri }}
              style={{
                width: 150,
                height: 150,
                marginRight: 10,
                borderRadius: 10,
              }}
            />
          ))}
        </ScrollView>
      )}
      {errors.imagenes && <Text style={styles.errorText}>{errors.imagenes}</Text>}

      {/* titulo */}
      <Text style={styles.label}>Título *</Text>
        {tipoPublicacion == 'producto' ? (
          // formulario de titulo para producto
          <TextInput 
            style={styles.input}
            placeholder="Ej. Bicicleta montañera"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
          />
        ) : (
          // formulario de titulo para servicio
          <TextInput 
            style={styles.input}
            placeholder="Ej. Clases de Python"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
          />
        )}

      {errors.titulo && <Text style={styles.errorText}>{errors.titulo}</Text>}
      
      {/* descripcion */}
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Agrega detalles importantes..."
        placeholderTextColor="#888"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}

      {/* Precio */}
      <Text style={styles.label}>
        {tipoPublicacion === 'producto' ? 'Precio *' : 'Precio por hora *'}
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />
      {errors.precio && <Text style={styles.errorText}>{errors.precio}</Text>}

      {/* Cantidad*/}
      <Text style={styles.label}>
        {tipoPublicacion === 'producto' ? 'Cantidad de productos*' : 'Cantidad de cupos*'}
      </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={cantidad}
          onChangeText={setCantidad}
        />
      {errors.cantidad && <Text style={styles.errorText}>{errors.cantidad}</Text>}

      {/* Estado del producto (no aplica para servicios) || Modalidad del servicio (no aplica para producto) */}
      <Text style={styles.label}>
        {tipoPublicacion === 'producto' ? 'Estado' : 'Modalidad del Servicio'}
      </Text>
      {tipoPublicacion == 'producto' ? (
          // formulario de Estado para producto
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
        ) : (
          // formulario de Modalidad para servicio
          <View style={styles.chipsContainer}>
            {modalidades.map((op) => (
              <TouchableOpacity
                key={op}
                style={[styles.chip, modalidad === op && styles.chipSelected]}
                onPress={() => setModalidad(op)}
              >
                <Text style={[styles.chipText, modalidad === op && styles.chipTextSelected]}>
                  {op}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      
      
      {/* Lugar de entrega (no aplica para servicios) || horario (no aplica para producto) */}
      <Text style={styles.label}>
        {tipoPublicacion === 'producto' ? 'Lugar entrega' : 'Horario'}
      </Text>
      {tipoPublicacion == 'producto' ? (
          // formulario de Lugar de entrega para producto
          <TextInput
            style={styles.input}
            value={lugarEntrega}
            onChangeText={setLugarEntrega}
          />
        ) : (
          // formulario de horario para servicio
          <View>
            <Text style={{marginBottom:10,}}>Selecciona tus dias de disponibilidad:</Text>
            <View style={styles.chipsContainer}>
              {semanas.map((op) => (
                <TouchableOpacity
                  key={op}
                  style={[
                    styles.chip,
                    diasSeleccionados.includes(op) && styles.chipSelected
                  ]}
                  onPress={() => {
                    setDiasSeleccionados(prev => {
                      const newSelection = prev.includes(op) 
                        ? prev.filter(dia => dia !== op) 
                        : [...prev, op];
                      
                      setHorario(prevHorario => ({
                        ...prevHorario,
                        [op]: prevHorario[op][0] === 'false' ? ['true'] : ['false'],
                      }));
                      
                      return newSelection;
                    });
                  }}
                >
                  <Text style={[styles.chipText, diasSeleccionados.includes(op) && styles.chipTextSelected]}>
                    {op}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* para una visualizacion en tiempo real */}
            {/* <Text style={styles.subtitle}>Horario actual:</Text>
            <Text>{JSON.stringify(horario, null, 2)}</Text> */}
          </View>
        )}

      {/* Metodos de pago */}
    <Text style={styles.label}>Método de pago *</Text>
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={metodoPago}
        onValueChange={(itemValue) => setMetodoPago(itemValue)}
        style={[
          Platform.OS === 'ios' ? styles.pickerIOS : styles.picker
        ]}
      >
        <Picker.Item key="pick" label="Selecciona un método de pago" value="" />
        {/*Muestra una lista de metodos de pago para seleccionar*/}
        {metodoPagos.map((met) => (
          <Picker.Item key={met} label={met} value={met}/>
        ))}
        </Picker>
    </View>
    {errors.metodoPago && <Text style={styles.errorText}>{errors.metodoPago}</Text>}

    {/* categorias */}
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
        {/* filtrar las categorias que son de producto y las que son de servicio MODIFICAR A FUTURO*/}
        {categorias
          .filter(cat => {
            //para producto
            if (tipoPublicacion === 'producto') {
              return !['Clases'].includes(cat.nombre);
            }
            //para servicio - Pd: por ahora solo se harcodea la categoria "Clase" para servicios, proximante mas
            if (tipoPublicacion === 'servicio') {
              return ['Clases'].includes(cat.nombre);
            }
          })
          .map((cat) => (
            <Picker.Item key={cat._id} label={cat.nombre} value={cat._id} />
          ))}
        </Picker>
    </View>
    
    {errors.categoria && <Text style={styles.errorText}>{errors.categoria}</Text>}

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
  errorText: {
  color: 'red',
  fontSize: 12,
  marginTop: 4,
},
  subtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 8,
    },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});
