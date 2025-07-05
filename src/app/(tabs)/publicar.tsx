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
import AntDesign from '@expo/vector-icons/AntDesign';

const estados = ['Nuevo', 'Usado', 'Reparado'];
const modalidades = ['Presencial', 'Asincrono', 'Híbrido'];
const metodoPagos = ['Efectivo', 'PagoMovil', 'Transferencia bancaria', 'Zelle', 'Paypal'];
const formaMonedas = ['Zelle', 'Binance', 'Zinli', 'efectivo', 'MercantilPanama'];
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
  const [precioTasa, setPrecioTasa] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estado, setEstado] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [formaMoneda, setFormaMoneda] = useState('');
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
  precioTasa?: string
  cantidad?: string;
  categoria?: string;
  metodoPago?: string;
  formaMoneda?: string;
  estado?: string;
  modalidad?: string;
  imagenes?: string;
  horarios?: string;
}
const [errors, setErrors] = useState<FormErrors>({});

const validarFormulario = (): FormErrors => {
  const errores: FormErrors = {};

  if (titulo.trim().length < 3 || titulo.length > 100) {
    errores.titulo = 'El título debe tener entre 3 y 100 caracteres.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  if (descripcion.length > 500) {
    errores.descripcion = 'La descripción no debe superar los 500 caracteres.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  const precioNumerico = parseFloat(precio);
  if (isNaN(precioNumerico) || precioNumerico < 0) {
      errores.precio = 'El precio debe ser un número válido mayor o igual a 0.';
      Alert.alert('Error', 'Por favor complete lo campos obligatorios');
    
  }

  const precioNumericoTasa = parseFloat(precioTasa);
  if (isNaN(precioNumericoTasa) && tipoPublicacion === 'Samanes'|| precioNumericoTasa < 0 && tipoPublicacion === 'Samanes') {
    errores.precioTasa = 'El precio de la tasa debe ser un número válido mayor o igual a 0.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  const cantidadNumerica = parseInt(cantidad);
  if (isNaN(cantidadNumerica) && tipoPublicacion === 'Producto'|| cantidadNumerica <= 0 && tipoPublicacion === 'Producto') {
    errores.cantidad = 'La cantidad debe ser un número válido mayor que 0.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  if (!categoria || categoria === '' || categoria === 'Selecciona una categoría') {
    errores.categoria = 'Debes seleccionar una categoría válida.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  const isHorarioInitial = JSON.stringify(horario) === JSON.stringify(HORARIO_INICIAL);
  if (isHorarioInitial &&  tipoPublicacion === 'Servicio') {
    errores.horarios = 'Debes seleccionar al menos un dia de disponibilidad.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  if (!metodoPago || metodoPago === '' || metodoPago === 'Selecciona un método de pago') {
    errores.metodoPago = 'Debes seleccionar un método de pago válido.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  if (!formaMoneda && tipoPublicacion === 'Samanes' || formaMoneda === '' && tipoPublicacion === 'Samanes' || formaMoneda === 'Selecciona la forma de los samanes 🌳' && tipoPublicacion === 'Samanes' ) {
    errores.formaMoneda = 'Debes seleccionar una forma de venta de los samanes válida.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  if (!estado && tipoPublicacion === 'Producto' || estado === '' && tipoPublicacion === 'Producto') {
    errores.estado = 'Debes seleccionar un estado para el producto.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  if (!modalidad && tipoPublicacion === 'Servicio'|| modalidad === '' && tipoPublicacion === 'Servicio') {
    errores.modalidad = 'Debes seleccionar un modalidad para el servicio.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
  }

  if (images.length === 0 && tipoPublicacion !== 'Samanes') {
    errores.imagenes = 'Debes seleccionar al menos una imagen.';
    Alert.alert('Error', 'Por favor complete lo campos obligatorios');
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
if (Object.keys(errores).length > 0) {
  setLoading(false);
  return;
}

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
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      precio: parseFloat(precio),
      precioTasa: parseFloat(precioTasa),
      cantidad: parseInt(cantidad),
      estado: estado.trim(),
      lugarEntrega: lugarEntrega.trim(),
      metodoPago: metodoPago.trim(),
      formaMoneda: formaMoneda.trim(),
      tipo: tipoPublicacion,
      modalidad: modalidad.trim(),
      horario,
      categoria: categoriaSeleccionada?.nombre?.trim(),
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
    setPrecioTasa('');
    setCantidad('');
    setEstado('');
    setModalidad('');
    setLugarEntrega('');
    setMetodoPago('');
    setFormaMoneda('');
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
  const tipoPublicacion: string = String(params.tipoPublicacion); // 'producto', 'servicio' o 'samanes'
  //console.log(tipoPublicacion)
  if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#F68628" />
      <Text style={{ marginTop: 10, color: '#555' }}>Subiendo publicación...</Text>
    </View>
  );
}

  const resetForm = () => {
  // Resetear todos los estados para asegurar que si hace cambio de formulario o se traiga los datos del formulario anterior
  setTitulo('');
  setDescripcion('');
  setPrecio('');
  setPrecioTasa('');
  setCantidad('');
  setEstado('');
  setModalidad('');
  setLugarEntrega('');
  setMetodoPago('');
  setFormaMoneda('');
  setCategoria('');
  setImages([]);
  setHorario(HORARIO_INICIAL);
  
  // Navegar al formulario
  router.push('/formularioPublicar');
};
  
  return (

    <ScrollView contentContainerStyle={styles.container}>
      {/* parte para salir del formulario */}
      <TouchableOpacity onPress={resetForm} style={styles.backButton} disabled={loading}>
        <Ionicons name="arrow-back" size={24} color="#00318D" />
      </TouchableOpacity>
      {/* titulo de la pagina */}
      <Text style={styles.titulo}>Crear Publicación</Text>
      {/* para cargar imagenes */}
      
      <View style={tipoPublicacion === 'Samanes' ? { display: 'none' } : null}>
        <Text style={styles.label}>
          {tipoPublicacion === 'Producto' ? 'Fotos del producto' : 'Fotos del servicio'}
        </Text>
        <TouchableOpacity style={styles.botonPublicar} onPress={pickImageAndStore} disabled={loading}>
          <Ionicons name="image-outline" size={20} color="#fff" />
          <Text style={styles.botonTexto}>Seleccionar Imagen</Text>
        </TouchableOpacity>
      
      {images.length > 0 &&(
        <ScrollView horizontal style={{ marginTop: 10 }} showsHorizontalScrollIndicator={false}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: img.uri }}
                style={styles.previewImage}
              />
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                }}
                disabled={loading}
              >
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {errors.imagenes && <Text style={styles.errorText}>{errors.imagenes}</Text>}
      </View>

      {/* titulo */}
      <Text style={styles.label}>Título *</Text>
        {tipoPublicacion === 'Producto' ? (
          // formulario de titulo para producto
          <TextInput 
            style={styles.input}
            placeholder="Ej. Bicicleta montañera"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
            editable={!loading}
          />
        ) : tipoPublicacion === 'Servicio' ? (
          // formulario de titulo para servicio
          <TextInput 
            style={styles.input}
            placeholder="Ej. Clases de Python"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
            editable={!loading}
          />
        ) :  (
          <TextInput 
            style={styles.input}
            placeholder="Ej. Venta de 10Cash"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
            editable={!loading}
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
        editable={!loading}
      />
      {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}

      {/* Precio para producto y servicio es el mismo, para Samanes es diferente */}
      <Text style={styles.label}>
        {
          tipoPublicacion === 'Producto' ? 'Precio *' : 
          tipoPublicacion === 'Servicio' ? 'Precio por hora *' : 
          'Valor de Venta *' // Para 'Samanes' o cualquier otro caso
        }
      </Text>
        {tipoPublicacion !== 'Samanes' ? (
          //Forma de vista del precio para publicaciones de tipo servico y producto
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
            <Text style={{ marginRight: 8, marginLeft: 8, fontSize: 25, fontWeight: 'bold' }}>$</Text>
            <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
            editable={!loading}
            />
          </View>
        ) : (
          //Forma de vista del precio para publicaciones de tipo Samanes (esta hecho para que se va bien con la Tasa de cambio (precioTasa))
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontSize: 25, fontWeight: 'bold'}}>🌳</Text>
            <TextInput
            style={styles.input2}
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
            editable={!loading}
            />
          </View>
          
        )}
        {errors.precio && <Text style={styles.errorText}>{errors.precio}</Text>}
      
      {/* Tasa de cambio (solo para publicaciones de tipo samanes) */}
      <View style={tipoPublicacion !== 'Samanes' ? { display: 'none' } : null}>
        {/* icono de cambio */}
        <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center', marginTop:30}}> 
          <AntDesign name="retweet" size={50} color="#FF8C00"/>
        </View>
        <Text style={styles.label}>Tasa *</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15}}>
          <TextInput
            style={styles.input2}
            keyboardType="numeric"
            value={precioTasa}
            onChangeText={setPrecioTasa}
            editable={!loading}
          />
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 7 }}>Bs</Text>
        </View>
        {errors.precioTasa && <Text style={styles.errorText}>{errors.precioTasa}</Text>}
      </View>
      
      {/* Cantidad (no aplica para samanes ni servicios)*/}
      <View style={tipoPublicacion !== 'Producto' ? { display: 'none' } : null}> 
        <Text style={styles.label}>
          Cantidad de productos*
        </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cantidad}
            onChangeText={setCantidad}
            editable={!loading}
          />
        {errors.cantidad && <Text style={styles.errorText}>{errors.cantidad}</Text>}  
      </View>

      {/* De aqui hasta la forma de metodo de pago es solamente para publicaciones de tipo producto o servicio*/}
      <View style={tipoPublicacion === 'Samanes' ? { display: 'none' } : null}> 

        {/* Estado del producto (no aplica para servicios, ni samanes) || Modalidad del servicio (no aplica para producto, ni samanes) */}
        <Text style={styles.label}>
          {tipoPublicacion === 'Producto' ? 'Estado' : 'Modalidad del Servicio'}
        </Text>
        {tipoPublicacion == 'Producto' ? (
            // formulario de Estado para producto
            <View style={styles.chipsContainer}>
              {estados.map((op) => (
                <TouchableOpacity
                  key={op}
                  style={[styles.chip, estado === op && styles.chipSelected]}
                  onPress={() => setEstado(op)}
                  disabled={loading}
                >
                  <Text style={[styles.chipText, estado === op && styles.chipTextSelected]}>
                    {op}
                  </Text>
                </TouchableOpacity>
              ))}
              {errors.estado && <Text style={styles.errorText}>{errors.estado}</Text>}
            </View> 
            
          ) : (
            // formulario de Modalidad para servicio
            <View style={styles.chipsContainer}>
              {modalidades.map((op) => (
                <TouchableOpacity
                  key={op}
                  style={[styles.chip, modalidad === op && styles.chipSelected]}
                  onPress={() => setModalidad(op)}
                  disabled={loading}
                >
                  <Text style={[styles.chipText, modalidad === op && styles.chipTextSelected]}>
                    {op}
                  </Text>
                </TouchableOpacity>
              ))} 
              {errors.modalidad && <Text style={styles.errorText}>{errors.modalidad}</Text>}
            </View>
          )}

        
        {/* Lugar de entrega (no aplica para servicios) || horario (no aplica para producto) */}
        <Text style={styles.label}>
          {tipoPublicacion === 'Producto' ? 'Lugar entrega' : 'Horario'}
        </Text>
        {tipoPublicacion == 'Producto' ? (
            // formulario de Lugar de entrega para producto
            <TextInput
              style={styles.input}
              value={lugarEntrega}
              onChangeText={setLugarEntrega}
              editable={!loading}
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
                    disabled={loading}
                  >
                    <Text style={[styles.chipText, diasSeleccionados.includes(op) && styles.chipTextSelected]}>
                      {op}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* para una visualizacion en tiempo real */}
              {/* <Text style={styles.subtitle}>Horario actual:</Text>
              <Text>{JSON.stringify(horario, nulsl, 2)}</Text> */}
            {errors.horarios && <Text style={styles.errorText}>{errors.horarios}</Text>}
            </View>
          )}
      </View> 

      {/* Forma de la moneda (los samanes) / solo para productos tipo Samanes*/}
      <View style={tipoPublicacion !== 'Samanes' ? { display: 'none' } : null}>
        <Text style={styles.label}>Forma de los Samanes 🌳*</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formaMoneda}
            onValueChange={(itemValue) => setFormaMoneda(itemValue)}
            style={[
              Platform.OS === 'ios' ? styles.pickerIOS : styles.picker
            ]}
            enabled={!loading}
          >
            <Picker.Item key="pick" label="Selecciona la forma de los samanes 🌳" value="" />
            {/*Muestra una lista de las formas de pago para seleccionar*/}
            {formaMonedas.map((forMon) => (
              <Picker.Item key={forMon} label={forMon} value={forMon}/>
            ))}
            </Picker>
        </View>
        {errors.formaMoneda && <Text style={styles.errorText}>{errors.formaMoneda}</Text>}
      </View>

      {/* Metodos de pago */}   
      <Text style={styles.label}>
      {tipoPublicacion === 'Samanes' ? 'Método de pago para los Samanes 🌳 en Bs *' : 'Método de pago *'}
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={metodoPago}
          onValueChange={(itemValue) => setMetodoPago(itemValue)}
          style={[
            Platform.OS === 'ios' ? styles.pickerIOS : styles.picker
          ]}
          enabled={!loading}
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
        enabled={!loading}
      >
        <Picker.Item key="pick" label="Selecciona una categoría" value="" />
        {/* filtrar las categorias que son de producto y las que son de servicio MODIFICAR A FUTURO*/}
        {categorias
          .filter(cat => {
            //para producto
            if (tipoPublicacion === 'Producto') {
              return ['Producto'].includes(cat.tipo);
            }
            //para servicio 
            if (tipoPublicacion === 'Servicio') {
              return ['Servicio'].includes(cat.tipo);
            }
            if (tipoPublicacion === 'Samanes') {
              return ['Samanes'].includes(cat.tipo);
            }
          })
          .map((cat) => (
            <Picker.Item key={cat._id} label={cat.nombre} value={cat._id} />
          ))}
        </Picker>
    </View>
    {errors.categoria && <Text style={styles.errorText}>{errors.categoria}</Text>}

    <TouchableOpacity
      style={[styles.botonPublicar, loading && { backgroundColor: '#ccc' }]}
      onPress={handlePublicar}
      disabled={loading}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.botonTexto}>  Subiendo...</Text>
        </>
      ) : (
        <>
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
          <Text style={styles.botonTexto}>Publicar</Text>
        </>
      )}
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
    minWidth: 310,
  },
  input2: {
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderColor: '#ddd',
    borderRadius: 100,
    width: 150,
    padding: 12,
    fontSize: 19,
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
    imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 2,
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
