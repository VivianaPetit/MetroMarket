// app/index.tsx
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a MetroMarket!</Text>
      <Text>
        Aquí podrás comprar y vender productos de la mejor calidad.
      </Text>
      <Button
  onPress={() => {
  }}
  title="Press Me"
/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
