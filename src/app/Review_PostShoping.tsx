import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';


const Review_PostShoping = () => {
  const router = useRouter();
  
  const params = useLocalSearchParams();
  
  const { 
    productName, 
    productPrice, 
    productPriceTasa,
    productType,
    sellerName, 
    sellerPhone, 
    purchaseDate,
    cantidad,
    transaccionId
  } = params as { 
    productId?: string; 
    productName?: string; 
    productPrice?: string; 
    productPriceTasa?: string;
    productType?: string;
    sellerName?: string; 
    sellerPhone?: string; 
    purchaseDate?: string;
    cantidad?: string;
    transaccionId?: string;
  };

  const orderDetails = {
    vendedor: sellerName || 'Vendedor desconocido',
    telefono: sellerPhone || 'No disponible',
    fecha: purchaseDate || new Date().toLocaleDateString(),
    producto: productName || 'Producto no especificado',
    precioUnitario: `$${parseFloat(productPrice || '0') / (parseInt(cantidad || '1') || 1)}`,
    precioTasa: productPriceTasa,
    productoTipo: productType,
    cantidad: cantidad || '1',
    precioTotal: `$${productPrice || '0.00'}`,
    idTransaccion: transaccionId || 'N/A',
  };

  const handleContactarVendedor = (transaccionId: string) => {
    if (!transaccionId) {
      alert('Transacción no identificada');
      return;
    }
    router.push({
      pathname: '/chat',
      params: { transaccionId },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/LogoMetroMarket.png')}
            style={{ width: 80, height: 80, resizeMode: 'contain' }}
          />
        </View>
        
        <Text style={styles.title}>¡Orden Completada!</Text>
        
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
            <Text style={styles.detailLabel}>
              {orderDetails.productoTipo === 'Samanes' ? 'Valor de venta:' : 'Precio unitario:'}
            </Text>
            <Text style={styles.detailValue}>{orderDetails.precioUnitario}</Text>
          </View>
          
          {orderDetails.productoTipo === 'Samanes' && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tasa vendedor:</Text>
              <Text style={styles.detailValue}>{orderDetails.precioTasa}Bs</Text>
          </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cantidad:</Text>
            <Text style={styles.detailValue}>{orderDetails.cantidad}</Text>
          </View>
          
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={[styles.detailLabel, styles.totalLabel]}>Total:</Text>
            <Text style={[styles.detailValue, styles.totalValue]}>{orderDetails.precioTotal}</Text>
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
          Puedes ver el estado de esta orden en la sección "Mis Compras".
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>Ir a Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button2} 
          onPress={() => handleContactarVendedor(orderDetails.idTransaccion)}
        >
          <Text style={styles.buttonText}>Ir al chat</Text>
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
    justifyContent: 'center',
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
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
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
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    flexShrink: 1,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#F68628',
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
  button2: {
    backgroundColor: '#00318D',
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
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },
});

export default Review_PostShoping;