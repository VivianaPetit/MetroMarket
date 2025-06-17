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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Categoria } from '../interfaces/types';
import { fetchCategorias } from '../services/categoriaService';
import { updatePublicacion, deletePublicacion } from '../services/actualizarService'; // Asegúrate de importar deletePublicacion

const estados = ['Nuevo', 'Usado', 'Reparado'];
const modalidades = ['Presencial', 'Asincrono', 'Híbrido'];
const metodoPagos = ['Efectivo', 'PagoMovil', 'Transferencia bancaria', 'Zelle', 'Paypal'];
const semanas = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

const EditarProducto = () => {
  const router = useRouter();
  const { producto } = useLocalSearchParams();
  const parsedProducto = producto ? JSON.parse(producto as string) : null;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState(parsedProducto?.titulo || '');
  const [descripcion, setDescripcion] = useState(parsedProducto?.descripcion || '');
  const [precio, setPrecio] = useState(parsedProducto?.precio?.toString() || '');
  const [cantidad, setCantidad] = useState(parsedProducto?.cantidad?.toString() || '');
  const [estado, setEstado] = useState(parsedProducto?.estado || '');
  const [disponible, setDisponible] = useState(parsedProducto?.disponible ?? true);
  const [lugarEntrega, setLugarEntrega] = useState(parsedProducto?.lugarEntrega || '');
  const [metodoPago, setMetodoPago] = useState(parsedProducto?.metodoPago || '');
  const [categoria, setCategoria] = useState(parsedProducto?.categoria || '');
  const [modalidad, setModalidad] = useState(parsedProducto?.modalidad || '');
  
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
  
  useEffect(() => {
    fetchCategorias()
      .then(data => setCategorias(data))
      .catch(console.error);
  }, []);

  const handleActualizar = async () => {
  if (!titulo || !precio || !cantidad) {
    Alert.alert('Error', 'Título, precio y cantidad son obligatorios.');
    return;
  }
  const isHorarioInitial = JSON.stringify(horario) === JSON.stringify(HORARIO_INICIAL);
  if (isHorarioInitial && parsedProducto?.tipo === 'servicio') {
    Alert.alert('Error', 'Debes seleccionar al menos un día de disponibilidad.');
    return;
  }

  try {
    const updated = await updatePublicacion(parsedProducto._id, {
      titulo,
      descripcion,
      precio,
      cantidad,
      estado,
      disponible,
      lugarEntrega,
      metodoPago,
      categoria,
      horario,
      modalidad,
    });

    Alert.alert('Éxito', `Producto "${updated.titulo}" actualizado correctamente.`);
    router.back();
  } catch (error) {
    Alert.alert('Error', 'No se pudo actualizar la publicación.');
  }
};

  const handleEliminar = async () => {
      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro que deseas eliminar esta publicación?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePublicacion(parsedProducto._id);
                Alert.alert('Éxito', 'Publicación eliminada correctamente');
                router.back();
              } catch (error) {
                Alert.alert('Error', 'No se pudo eliminar la publicación');
              }
            },
          },
        ]
      );
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#00318D" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Editar Publicación</Text>

      {/* titulo */}
      <Text style={styles.label}>Título *</Text>
        {parsedProducto?.tipo == 'producto' ? (
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
      {/* precio */}
      <Text style={styles.label}>
        {parsedProducto?.tipo === 'producto' ? 'Precio *' : 'Precio por hora *'}
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      {/* Cantidad */}
      <Text style={styles.label}>
        {parsedProducto?.tipo === 'producto' ? 'Cantidad de productos*' : 'Cantidad de cupos*'}
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
      />

      {/* Estado del producto (no aplica para servicios) || Modalidad del servicio (no aplica para producto) */}
      <Text style={styles.label}>
        {parsedProducto?.tipo === 'producto' ? 'Estado' : 'Modalidad del Servicio'}
      </Text>
        {parsedProducto?.tipo == 'producto' ? (
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
      
      {/* disponibilidad */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Disponible?</Text>
        <Switch
          value={disponible}
          onValueChange={setDisponible}
          thumbColor={disponible ? '#fff' : '#00318D'}
          trackColor={{ true: '#00318D', false: '#999' }}
        />
      </View>
      
      {/* Lugar de entrega (no aplica para servicios) || horario (no aplica para producto) */}
      <Text style={styles.label}>
        {parsedProducto?.tipo === 'producto' ? 'Lugar entrega' : 'Horario'}
      </Text>      
        {parsedProducto?.tipo == 'producto' ? (
          // formulario de Lugar de entrega para producto
          <TextInput
            style={styles.input}
            value={lugarEntrega}
            onChangeText={setLugarEntrega}
          />
        ) : (
          // formulario de horario para servicio
          <View>
            <Text style={{marginBottom:10,}}>Selecciona tus dias de disponibilidad nuevamente:</Text>
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
            {/* <Text>Horario actual:</Text>
            <Text>{JSON.stringify(horario, null, 2)}</Text> */}
          </View>
        )}

      <Text style={styles.label}>Método de pago</Text>
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
        
        {/* filtrar las categorias que son de producto y las que son de servicio MODIFICAR A FUTURO*/}
        {categorias
          .filter(cat => {
            //para producto
            if (parsedProducto?.tipo === 'producto') {
              return !['Clases'].includes(cat.nombre);
            }
            //para servicio - Pd: por ahora solo se harcodea la categoria "Clase" para servicios, proximante mas
            if (parsedProducto?.tipo === 'servicio') {
              return ['Clases'].includes(cat.nombre);
            }
          })
          .map((cat) => (
            <Picker.Item key={cat._id} label={cat.nombre} value={cat._id} />
          ))}
        </Picker>
    </View>      

      <TouchableOpacity style={styles.botonPublicar} onPress={handleActualizar}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Actualizar</Text>
      </TouchableOpacity>

       <TouchableOpacity 
        style={styles.botonEliminar} 
        onPress={handleEliminar}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Eliminar publicación</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditarProducto;

// Reutilizamos tus estilos originales
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
  botonEliminar: {
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: '#FF3B30', // Rojo estándar para acciones destructivas
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
