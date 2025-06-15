import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const Review_PostShoping = () => {
  const router = useRouter();
  
  const params = useLocalSearchParams();
  
  const { 
    productId, 
    productName, 
    productPrice, 
    sellerName, 
    sellerPhone, 
    purchaseDate 
  } = params as { 
    productId?: string; 
    productName?: string; 
    productPrice?: string; 
    sellerName?: string; 
    sellerPhone?: string; 
    purchaseDate?: string; 
  };

  const orderDetails = {
    vendedor: sellerName || 'Vendedor desconocido',
    telefono: sellerPhone || 'No disponible',
    fecha: purchaseDate || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    producto: productName || 'Producto no especificado',
    precio: `$${productPrice || '0.00'}`
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={90} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>¡Compra Completada!</Text>
        
        <Text style={styles.subtitle}>
          {orderDetails.vendedor} ha recibido tu orden. Gracias por tu compra.
        </Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalles de la Orden</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>{orderDetails.fecha}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Producto:</Text>
            <Text style={styles.detailValue}>{orderDetails.producto}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Precio:</Text>
            <Text style={styles.detailValue}>{orderDetails.precio}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vendedor:</Text>
            <Text style={styles.detailValue}>{orderDetails.vendedor}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contacto:</Text>
            <Text style={styles.detailValue}>{orderDetails.telefono}</Text>
          </View>
        </View>
        
        <Text style={styles.infoText}>
          Puedes dejar una reseña sobre tu experiencia con este vendedor en la sección "Mis Compras".
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>Ir a Inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginVertical: 30,
    backgroundColor: '#e6ffe6',
    borderRadius: 50,
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 35,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    flexShrink: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#F68628',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#F68628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },
});

export default Review_PostShoping;