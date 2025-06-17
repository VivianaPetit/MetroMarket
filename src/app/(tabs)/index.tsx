// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const params = useLocalSearchParams(); // ← Obtiene params de la navegación
  const categoriaParam = typeof params.categoria === 'string' ? params.categoria : null;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { user } = useAuth();

  // Cargar categorías y publicaciones al montar
  useEffect(() => {
    fetchCategorias()
      .then(data => setCategorias(data))
      .catch(console.error);

    fetchPublicaciones()
      .then(data => {
        setPublicaciones(data);
        if (categoriaParam) {
          setSelectedCategory(categoriaParam); // ← Filtra automáticamente si viene param
        }
      })
      .catch(console.error);
  }, [categoriaParam]);

  useFocusEffect(
    useCallback(() => {
      fetchPublicaciones()
        .then(data => setPublicaciones(data))
        .catch(console.error);
    }, [])
  );

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(current => 
      current === categoryName ? null : categoryName
    );
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearch("");
  };

  // Filtro combinado
  const getFilteredPublications = () => {
    let filtered = [...publicaciones];

    if (selectedCategory) {
      filtered = filtered.filter(pub => pub.categoria === selectedCategory);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(pub => 
        pub.titulo.toLowerCase().includes(searchTerm) || 
        pub.categoria.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  };

  const filteredPublications = getFilteredPublications();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={18} color="#bbb" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar producto..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesWrapper}>
            {categorias.map((cat) => (
              <CategoryBadge
                key={cat._id}
                label={cat.nombre}
                imageSource={cat.foto}
                isSelected={selectedCategory === cat.nombre}
                onPress={() => handleCategoryPress(cat.nombre)}
              />
            ))}
          </ScrollView>

          <View style={styles.productsGrid}>
            {filteredPublications.length > 0 ? (
              filteredPublications.map((pub) => (
                <TouchableOpacity
                  key={pub._id}
                  onPress={() => router.push({
                    pathname: "/productDetails",
                    params: { productId: pub._id }
                  })}
                  activeOpacity={0.7}
                >
                  <ProductCard
                    name={pub.titulo}
                    price={pub.precio}
                    category={pub.categoria}
                    image={pub.fotos?.[0] ?? 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg'}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="sad-outline" size={48} color="#888" />
                {search.length > 0 && selectedCategory != null ? (
                  <Text style={styles.emptyText}>
                    No hay resultados para <Text style={styles.searchText}>"{search}"</Text> en la categoría{' '}
                    <Text style={styles.selectedCategoryText}>{selectedCategory}</Text>
                  </Text>
                ) : (
                  <Text style={styles.emptyText}>
                    No hay resultados para{' '}
                    <Text style={styles.selectedCategoryText}>{selectedCategory || search}</Text>
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 80 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 16,
    paddingHorizontal: 15,
    height: 45,
    elevation: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  categoriesWrapper: {
    marginTop: 12,
    paddingLeft: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  emptyContainer: {
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
  selectedCategoryText: {
    fontWeight: 'bold',
    color: '#00318D',
  },
  searchText: {
    fontWeight: 'bold',
    color: '#FF8C00',
  },
});
