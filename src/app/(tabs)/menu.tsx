import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useAuth } from '../../context/userContext';

export default function Perfil() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout?.();
    router.push('./');
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Card */}
      <TouchableOpacity
        style={styles.menuButton}
        activeOpacity={1}
        onPress={() => {
          if (user) {
            router.push('../../perfil');
          }
        }}
      >
        <View style={styles.guestCardContent}>
          {user?.foto ? (
            <Image 
              source={{ uri: user.foto }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileIconContainer}>
              <Ionicons name="person-outline" size={30} color="#fff" />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.guestText}>{user?.nombre ?? 'Invitado'}</Text>
            {user?.correo && (
              <Text style={styles.emailText}>{user.correo}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

       <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('./')}
        activeOpacity={0.8}
      >
        <View style={styles.publicationsButtonContent}>
          <Ionicons name="home-outline" size={24} color="#FF8C00" />
          <Text style={styles.publicationsButtonText}>Inicio</Text>
        </View>
      </TouchableOpacity>

      {user && (
        <>
          {/* Mis Publicaciones */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('../publicaciones')}
            activeOpacity={0.8}
          >
            <View style={styles.publicationsButtonContent}>
              <Ionicons name="grid-outline" size={24} color="#FF8C00" />
              <Text style={styles.publicationsButtonText}>Mis publicaciones</Text>
            </View>
          </TouchableOpacity>

          {/* Mis Favoritos */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('../favoritos')}
            activeOpacity={0.8}
          >
            <View style={styles.publicationsButtonContent}>
              <Ionicons name="heart-outline" size={24} color="#FF8C00" />
              <Text style={styles.publicationsButtonText}>Mis favoritos</Text>
            </View>
          </TouchableOpacity>

          {/* Mis Compras */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('../compras')}
            activeOpacity={0.8}
          >
            <View style={styles.publicationsButtonContent}>
              <Ionicons name="cart-outline" size={24} color="#FF8C00" />
              <Text style={styles.publicationsButtonText}>Mis compras</Text>
            </View>
          </TouchableOpacity>

          {/* Mis Ventas */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('../ventas')}
            activeOpacity={0.8}
          >
            <View style={styles.publicationsButtonContent}>
              <Ionicons name="cash-outline" size={24} color="#FF8C00" />
              <Text style={styles.publicationsButtonText}>Mis ventas</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

      {/* Iniciar/Cerrar Sesión */}
      {user ? (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.loginButtonContent}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.loginButtonText}>Cerrar sesión</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <View style={styles.loginButtonContent}>
            <Ionicons name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: 70,
  },
  guestCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00318D',
    padding: 16,
    borderRadius: 12,
    height: 70,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10, // Aumenté el margen derecho
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10, // Mismo margen que la imagen para consistencia
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 3, // Pequeño margen izquierdo adicional
  },
  guestText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2, // Espacio entre nombre y email
  },
  emailText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 70,
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
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 70,
  },
  publicationsButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});