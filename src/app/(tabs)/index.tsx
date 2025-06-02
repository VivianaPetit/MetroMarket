import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert,} from 'react-native'; // <-- NEW: Import Alert for example
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CategoryBadge } from '../../components/Category';
import ProductCard from '../../components/ProductCard'; 
import { Categoria, Publicacion } from '../../interfaces/types'; 
import { fetchCategorias } from '../../services/categoriaService';
import { fetchPublicaciones } from '../../services/publicacionService';
import { AuthProvider, useAuth } from '../../context/userContext';


export default function Home() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const filteredPublications = publicaciones.filter((pub) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    const titleMatch = pub.titulo.toLowerCase().includes(searchTerm);
    const categoryMatch = pub.categoria.toLowerCase().includes(searchTerm);
    return titleMatch || categoryMatch;
  });

  useEffect(() => {
    fetchCategorias()
      .then(data => setCategorias(data.slice(0, 10)))
      .catch(console.error);

    fetchPublicaciones()
      .then(data => setPublicaciones(data))
      .catch(console.error);
  }, []);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategoryId(current => 
      current === categoryId ? null : categoryId
    );
  };

  // <-- NEW: Handler for the edit icon press
  const handleEditProduct = (productId: string, productName: string) => {
    Alert.alert('Editar Producto', `Has presionado editar para: ${productName} (ID: ${productId})`);
    // Here, you would typically navigate to an edit screen:
    // router.push(`/edit-product/${productId}`);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={{ color: '#00318D', fontWeight: 'bold' }}>Metro</Text>
          <Text style={{ color: '#FF8C00', fontWeight: 'bold' }}>Market</Text>
        </Text>
        { user ? (<TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/Perfil')}>
          <Ionicons name="person" size={24} color="#00318D" />
        </TouchableOpacity>) : (
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/login')}>  
            <Ionicons name="log-in-outline" size={24} color="#00318D" />
          </TouchableOpacity>)
        }
      </SafeAreaView> 

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#bbb" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={(text) => setSearch(text)}
          returnKeyType="search"
        />
      </View>

      {/* Categorias */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categorias.map((cat) => (
            <CategoryBadge 
              key={cat._id}
              label={cat.nombre}
              isSelected={selectedCategoryId === cat._id}
              onPress={() => handleCategoryPress(cat._id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Products */}
      <ScrollView contentContainerStyle={styles.productsGrid}>
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub) => (
            <ProductCard
              key={pub._id}
              name={pub.titulo}
              price={pub.precio}
              category={pub.categoria}
              image={
                pub.fotos && pub.fotos.length > 0
                  ? pub.fotos[0]
                  : 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg'
              }
              
              //onEdit={() => handleEditProduct(pub._id, pub.titulo)} // Example: Pass ID and title
            />
          ))
        ) : (
          <Text style={styles.errorMensaje}>No se encontraron productos</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerIcon: {
    paddingLeft: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 15,
    height: 45,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoriesWrapper: {
    marginTop: 12,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  errorMensaje: {
    fontSize: 20,
    flexDirection: 'row', // This won't do much for a single Text component
    flexWrap: 'wrap',
    textAlign: 'center', // Added for better centering of the message
    width: '100%', // Ensure it takes full width to center
    marginTop: 20,
  },
});