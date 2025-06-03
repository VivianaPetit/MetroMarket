import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/userContext'; // Asegúrate de que la ruta sea correcta
import { editarUsuario } from '../services/usuarioService';
import React, { useState } from 'react';


export default function Perfil() {

  const router = useRouter();
  const { user, logout, setUser } = useAuth();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre ?? '');
  const [telefono, setTelefono] = useState(user?.telefono ?? '');

  const handleLogout = () => {
    logout?.(); 
    router.push('/');
  };

  const handleGuardar = async () => {
    try {
      const usuarioActualizado = await editarUsuario(user._id, { nombre, telefono });
      setUser(usuarioActualizado); // Actualizar en el contexto
      setModoEdicion(false);
    } catch (error) {
      alert('Hubo un error actualizando el perfil');
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.containerAcc}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={{ width: 30 }} />
          <Text style={styles.title}>Mi Perfil</Text>
          <TouchableOpacity onPress={() => setModoEdicion(!modoEdicion)}>
            <Ionicons name={modoEdicion ? "close" : "create"} color="white" size={30} />
          </TouchableOpacity>
        </View>

        <ProfileCard
          UserName={user?.correo ?? 'Usuario'}
          nombreyA={modoEdicion ? nombre : user?.nombre ?? 'Nombre'}
          tlf={modoEdicion ? telefono : user?.telefono ?? ''}
          editable={modoEdicion}
          onNombreChange={setNombre}
          onTelefonoChange={setTelefono}
        />
      </View>

      {modoEdicion && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleGuardar}>
          <Ionicons name="save" color="green" size={24} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: 'green', fontSize: 16 }}>Guardar Cambios</Text>
          </View>
        </TouchableOpacity>
      )}

      {!modoEdicion && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" color="gray" size={24} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: 'gray', fontSize: 16 }}>Cerrar Sesión</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerAcc: {
    backgroundColor: '#00318D',
    padding: 10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 62
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'white'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 12,
    margin: 20,
    borderRadius: 10
  },
  circleContainer: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden'
  },
  circleImage: {
    width: '100%',
    height: '100%'
  },
  DatosContainer: {
    alignSelf: 'flex-start',
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#00256B',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    marginBottom: 5
  },
    backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5
  },
});
