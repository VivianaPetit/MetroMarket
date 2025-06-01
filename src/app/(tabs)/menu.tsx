import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Option from '../../components/Option';

export default function Perfil() {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={50} color="#fff" />
        <View style={styles.profileText}>
          <Text style={styles.username}>Usuario1</Text>
          <Text style={styles.email}>usuario@correo.unimet.edu.ve</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Option icon="list-outline" title="Mis Publicaciones" />
        <Option icon="log-out-outline" title="Log out" subtitle="Further secure your account for safety" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  email: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 4,
  },
});
