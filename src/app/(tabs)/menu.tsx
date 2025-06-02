import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/userContext';

const Menu = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout?.(); // Cerrar sesión si la función existe
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header}>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
        <Text style={styles.headerText}>
          {user ? user.nombre : 'Invitado'}
        </Text>
      </TouchableOpacity>

      {user ? (
        <>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/Publicaciones')}>
            <MaterialCommunityIcons name="apps" size={20} color="#FF8C00" />
            <Text style={styles.cardText}>Mis publicaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#FF8C00" />
            <Text style={styles.cardText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.card} onPress={() => router.push('/login')}>
          <MaterialCommunityIcons name="login" size={20} color="#FF8C00" />
          <Text style={styles.cardText}>Iniciar sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignSelf: 'center',
    gap: 12,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#00318D',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    gap: 8,
  },
  cardText: {
    color: '#FF8C00',
    fontSize: 15,
    fontWeight: '500',
  },
});
