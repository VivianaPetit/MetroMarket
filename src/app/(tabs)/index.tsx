// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CategoryBadge } from '../../components/Category';
import ProductCard from '../../components/ProductCard'; 
import { Categoria, Publicacion } from '../../interfaces/types'; 
import { fetchCategorias } from '../../services/categoriaService';
import { fetchPublicaciones } from '../../services/publicacionService';
import { useFocusEffect } from '@react-navigation/native'; 
import { useAuth } from '../../context/userContext';

export default function Home() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [publicacionesCategoria, setPublicacionesCategoria] = useState<Publicacion[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("1"); // "1" es el I
  const [search, setSearch] = useState("");
  
  const { user } = useAuth();
  var boolean1 = false
  var boolean2 = false

  const filteredPublications = publicaciones.filter((pub) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    const titleMatch = pub.titulo.toLowerCase().includes(searchTerm);
    const categoryMatch = pub.categoria.toLowerCase().includes(searchTerm);
     boolean2 = false;
     boolean1 = true;
    return titleMatch || categoryMatch;
  });

  const reseteo = () => {
  fetchPublicaciones()
    .then(data => setPublicacionesCategoria(data))
    .catch(console.error);
  setSelectedCategoryId("1"); // Asegurar que "Todos" esté seleccionado
  boolean1 = false;
  boolean2 = false;
};

  useEffect(() => {
    fetchCategorias()
      .then(data => setCategorias(data))
      .catch(console.error);

          fetchPublicaciones()
      .then(data => setPublicacionesCategoria(data))
      .catch(console.error);
  }, []);

  // ✅ Reemplaza useEffect por useFocusEffect para publicaciones
  useFocusEffect(
    useCallback(() => {
      fetchPublicaciones()
        .then(data => setPublicaciones(data))
        .catch(console.error);
    }, [])
  );

  const handleCategoryPress = (categoryId: string, category: string) => {
  if (selectedCategoryId === categoryId) {
    // Si se hace clic en la categoría ya seleccionada, volver a "Todos"
    setSelectedCategoryId("1");
    fetchPublicaciones()
      .then(data => setPublicacionesCategoria(data))
      .catch(console.error);
    boolean1 = false;
    boolean2 = false;
  } else {
    // Seleccionar nueva categoría
    setSelectedCategoryId(categoryId);
    const filtered = publicaciones.filter(user => user.categoria.includes(category));
    setPublicacionesCategoria(filtered);
    boolean1 = false;
    boolean2 = true;
  }
};


  const handleEditProduct = (productId: string, productName: string) => {
    Alert.alert('Editar Producto', `Has presionado editar para: ${productName} (ID: ${productId})`);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={{ color: '#00318D', fontWeight: 'bold' }}>Metro</Text>
          <Text style={{ color: '#FF8C00', fontWeight: 'bold' }}>Market</Text>
        </Text>
        { user ? (
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/Perfil')}>
            <Ionicons name="person" size={24} color="#00318D" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/login')}>
            <Ionicons name="log-in-outline" size={24} color="#00318D" />
          </TouchableOpacity>
        )}
      </SafeAreaView> 

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

      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
                   <CategoryBadge 
              key={1}
              label={"Todos"}
              isSelected={selectedCategoryId === "1"}
              onPress={() => reseteo()}
            />
          {categorias.map((cat) => (
            <CategoryBadge 
              key={cat._id}
              label={cat.nombre}
              isSelected={selectedCategoryId === cat._id}
              onPress={() => handleCategoryPress(cat._id,cat.nombre)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Products */}
<ScrollView contentContainerStyle={styles.productsGrid}>
  {filteredPublications.length > 0 && boolean1 ? (
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
      />
    ))
  ) : (
    publicacionesCategoria.length > 0 ? (
      publicacionesCategoria.map((pub) => (
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
        />
      ))
    ) : (
      <View style={styles.emptyContainer}>
        <Ionicons name="sad-outline" size={48} color="#888" />
        <Text style={styles.emptyText}>No hay productos en esta categoría</Text>
      </View>
    )
  )}
</ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerIcon: { paddingLeft: 10, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 30, marginHorizontal: 16, marginTop: 10, paddingHorizontal: 15,
    height: 45, elevation: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  categoriesWrapper: { marginTop: 12, paddingBottom: 10, backgroundColor: '#f8f8f8' },
  categoriesContainer: { paddingHorizontal: 16 },
  productsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 80,
  },
  errorMensaje: {
    fontSize: 20, textAlign: 'center', width: '100%', marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
});

