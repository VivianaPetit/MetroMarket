import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function Publicar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publica algo a vender!</Text>
      <Text style={styles.subtitle}>
        Aquí podrás publicar tus productos para que otros los vean y compren.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => alert('Aquí va el formulario')}>
        <Text style={styles.buttonText}>Comenzar a Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#F68628',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
