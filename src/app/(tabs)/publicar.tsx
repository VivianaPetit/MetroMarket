import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const estados = ['Nuevo', 'Usado', 'Reparado'];
const metodosPago = ['Efectivo', 'Transferencia', 'Pago móvil', 'Otro'];

const CreatePublication = () => {
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estado, setEstado] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  const handlePublicar = () => {
    if (!titulo || !precio || !cantidad) {
      Alert.alert('Error', 'Título, precio y cantidad son obligatorios.');
      return;
    }

    Alert.alert('¡Éxito!', 'Tu publicación ha sido creada.');
    // Aquí iría la lógica para enviar los datos
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#00318D" />
      </TouchableOpacity>

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
            style={[
              styles.chip,
              estado === op && styles.chipSelected,
            ]}
            onPress={() => setEstado(op)}
          >
            <Text style={[
              styles.chipText,
              estado === op && styles.chipTextSelected,
            ]}>{op}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Disponible?</Text>
        <Switch
          value={disponible}
          onValueChange={setDisponible}
          thumbColor={disponible ? '#fff' : '#00318D'}
        />
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
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={categoriaSeleccionada}
          onValueChange={(itemValue) => setCategoriaSeleccionada(itemValue)}
          style={styles.picker}
          dropdownIconColor="#333"
        >
          <Picker.Item label="Electrónica" value="Electrónica" />
          <Picker.Item label="Moda" value="Moda" />
          <Picker.Item label="Hogar" value="Hogar" />
          <Picker.Item label="Libros" value="Libros" />
          <Picker.Item label="Deportes" value="Deportes" />
          <Picker.Item label="Otros" value="Otros" />
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
  pickerContainer: {
    fontColor: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    overflow: 'hidden',
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
