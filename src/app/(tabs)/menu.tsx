import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../context/userContext';

export default function Perfil() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={50} color="#fff" />
        <View style={styles.profileText}>
          <Text style={styles.username}>{user?.nombre ?? 'Invitado'}</Text>
        </View>
      </View>

      {!user && (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
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
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00318D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 5,
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#FF8C00', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',

  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
