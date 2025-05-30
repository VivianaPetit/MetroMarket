import { StyleSheet, Text, View } from 'react-native';

export default function Divisas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambio de Divisas</Text>
      <Text>En esta sección podrás comprar/vender divisas.</Text>
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
