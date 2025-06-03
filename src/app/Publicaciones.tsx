import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/userContext'; // <-- 🔹 IMPORTA el contexto
import { CategoryBadge } from '../components/Category';
import ProductCard from '../components/ProductCard';
import { Categoria, Publicacion } from '../interfaces/types';
import { fetchCategorias } from '../services/categoriaService';
import { fetchPublicaciones } from '../services/publicacionService';
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth(); 
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

 useEffect(() => {
     fetchCategorias()
       .then(data => setCategorias(data))
       .catch(console.error);
   }, []);
 
   // ✅ Reemplaza useEffect por useFocusEffect para publicaciones
   useFocusEffect(
  useCallback(() => {
    if (!user) {
      setPublicaciones([]);
      return;
    }
    fetchPublicaciones()
      .then(data => setPublicaciones(data))
      .catch(console.error);
  }, [user?._id]) // <-- agregar dependencia del usuario
);

  // 🔹 Filtra por usuario autenticado
  const publicacionesDelUsuario = publicaciones.filter(pub =>
    user?.publicaciones?.includes(pub._id)
  );

  // 🔹 Aplica búsqueda sobre las publicaciones del usuario
  const filteredPublications = publicacionesDelUsuario.filter((pub) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    const titleMatch = pub.titulo.toLowerCase().includes(searchTerm);
    const categoryMatch = pub.categoria.toLowerCase().includes(searchTerm);
    return titleMatch || categoryMatch;
  });

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategoryId(current => current === categoryId ? null : categoryId);
  };

  const handleEditProduct = (producto: Publicacion) => {
    router.push({
      pathname: '/EditarProducto',
      params: { producto: JSON.stringify(producto) },
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
            onPress={() => router.push('/menu')}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#00318D" />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>
          <Text style={{ color: '#00318D', fontWeight: 'bold' }}>Metro</Text>
          <Text style={{ color: '#FF8C00', fontWeight: 'bold' }}>Market</Text>
        </Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/Perfil')}>
          <Ionicons name="person" size={24} color="#00318D" />
        </TouchableOpacity>
      </SafeAreaView>

      <View >
        
      </View>

      {/* Productos */}
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
              onEdit={() => handleEditProduct(pub)}
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
   backButton: {
    marginRight: 10,
    paddingBottom: 20,
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