import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { use } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/userContext';

export default function Perfil() {
  const { user, logout } = useAuth();
  const router = useRouter();

    const handleLogout = () => {
    logout?.(); 
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Invitado/User Card */}
      <TouchableOpacity
        style={styles.menuButton}
        activeOpacity={1} // Make it not dim on touch for consistent look
      >
        <View style={styles.guestCardContent}>
          <Ionicons name="person-outline" size={30} color="#fff" />
          <Text style={styles.guestText}>{user?.nombre ?? 'Invitado'}</Text>
        </View>
      </TouchableOpacity>

      {/* Iniciar Sesión Button */}
      {user ? (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <View style={styles.loginButtonContent}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.loginButtonText}>Cerrar sesion</Text>
          </View>
        </TouchableOpacity>
      ): (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.loginButtonContent}>
            <Ionicons name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.loginButtonText}>Iniciar sesion</Text>
          </View>
        </TouchableOpacity>
      ) }

      {user && (
        <TouchableOpacity
        style={styles.menuButton}
         onPress={() => router.push('../Publicaciones')}
        activeOpacity={0.8}
      >
        <View style={styles.publicationsButtonContent}>
          <Ionicons name="grid-outline" size={24} color="#FF8C00" />
          <Text style={styles.publicationsButtonText}>Mis publicaciones</Text>
        </View>
      </TouchableOpacity>
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 30, // Adjust top padding to match the image

  },
  menuButton: {
    backgroundColor: '#fff', // Default background for buttons, will be overridden
    borderRadius: 12,
    marginBottom: 20, // Space between buttons
    // Shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height : 70,

  },
  guestCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00318D', // Blue background for guest card
    padding: 16,
    borderRadius: 12,
    height : 70,
  },
  guestText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00', // Orange background for login button
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height : 70,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  publicationsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for publications button
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height : 70,
  },
  publicationsButtonText: {
    color: '#000', // Black text for publications button
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});