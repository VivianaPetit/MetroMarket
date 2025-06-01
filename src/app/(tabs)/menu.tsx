import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Menu() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <Text>Aca puede ir el perfil, ver las publicaciones, etc.</Text>
      {/* Barra de categorias */}
      <ScrollView
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>hola</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>si</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>si</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>si</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>si</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>si</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoryContainer:{
    justifyContent: 'center'
  },
  categoryButton: {
    backgroundColor: '#F9A35B',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 18,
    marginRight: 10,
    marginLeft: 5,
    paddingHorizontal: 50,
    paddingVertical:5,
    height: 45,
  },
  categoryText:{
    fontWeight: '600',
  }
});
