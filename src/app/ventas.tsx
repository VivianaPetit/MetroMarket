import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/userContext'; // Asegúrate que este hook esté bien implementado

const MisComprasScreen = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Ionicons name="person-circle-outline" size={64} color="#ccc" />
        <Text style={styles.title}>No has iniciado sesión</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="cart-outline" size={64} color="#F68628" style={styles.icon} />
      <Text style={styles.title}>Mis Compras</Text>

      <Text style={styles.subtitle}>Transacciones del usuario:</Text>
      {user.transacciones?.length ? (
        user.transacciones.map((transId: string, index: number) => (
          <View key={index} style={styles.transaccionBox}>
            <Text style={styles.transId}>• {transId}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyMessage}>No tienes transacciones aún.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  transaccionBox: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    marginBottom: 8,
    width: '100%',
    borderRadius: 6,
  },
  transId: {
    fontSize: 14,
    color: '#333',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});

export default MisComprasScreen;