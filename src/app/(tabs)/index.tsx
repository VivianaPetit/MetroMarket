// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CategoryBadge } from '../../components/Category';
import ProductCard from '../../components/ProductCard'; 
import { Categoria, Publicacion } from '../../interfaces/types'; 
import { fetchCategorias } from '../../services/categoriaService';
import { fetchPublicaciones } from '../../services/publicacionService';
import { useFocusEffect } from '@react-navigation/native'; 
import { useAuth } from '../../context/userContext';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

// Función para obtener categorías destacadas del día
const getFeaturedCategories = (categorias: Categoria[], count = 3): Categoria[] => {
  if (categorias.length <= count) return categorias;
  
  // Usamos el día del año como semilla para cambiar diariamente
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = dayOfYear % categorias.length;
  
  // Rotamos las categorías basadas en el día del año
  const rotatedCategories = [...categorias.slice(seed), ...categorias.slice(0, seed)];
  return rotatedCategories.slice(0, count);
};

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [sponsoredPosts, setSponsoredPosts] = useState<Publicacion[]>([]);
  const [search, setSearch] = useState("");
  const [featuredCategories, setFeaturedCategories] = useState<Categoria[]>([]);

  const { user } = useAuth();

  // Cargar categorías y publicaciones al montar
  useEffect(() => {
    fetchCategorias()
      .then(data => {
        setCategorias(data);
        setFeaturedCategories(getFeaturedCategories(data));
      })
      .catch(console.error);

    fetchPublicaciones()
      .then(data => {
        setPublicaciones(data);
        // Filtrar publicaciones patrocinadas 
        const sponsored = data.filter(pub => pub.esPatrocinada && pub.eliminado === false);
        setSponsoredPosts(sponsored);
      })
      .catch(console.error);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPublicaciones()
        .then(data => {
          setPublicaciones(data);
          const sponsored = data.filter(pub => pub.esPatrocinada && pub.eliminado === false);
          setSponsoredPosts(sponsored);
        })
        .catch(console.error);
    }, [])
  );

  const handleCategoryPress = (categoryName: string) => {
    
  };

  const getProductsByCategory = (category: string, limit = 4) => {
    return publicaciones
      .filter(pub => pub.categoria === category && pub.eliminado === false)
      .slice(0, limit);
  };

  const renderCategorySection = (category: Categoria) => {
    const products = getProductsByCategory(category.nombre);
    
    if (products.length === 0) return null;

    return (
      <View key={category._id} style={styles.categorySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{category.nombre}</Text>
          <TouchableOpacity onPress={() => router.push({
                  pathname: "./categoria",
                  params: { category: category.nombre }
                })}>
            <Text style={styles.seeAllText}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.horizontalScroll}>
          {products.map((pub) => (
            <View style={styles.productCardWrapper} key={pub._id}>
              <ProductCard
                name={pub.titulo}
                price={pub.precio}
                priceTasa={pub.precioTasa}
                formCoin={pub.formaMoneda}
                category={pub.categoria}
                image={pub.fotos?.[0] ?? 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg'}
                tipo={pub.tipo}
                onPress={() => router.push({
                  pathname: "/productDetails",
                  params: { productId: pub._id }
                })}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSponsoredItem = ({ item }: { item: Publicacion }) => {
    return (
      <TouchableOpacity
        style={styles.sponsoredCard}
        onPress={() => router.push({
          pathname: "/productDetails",
          params: { productId: item._id }
        })}
      >
        <View style={styles.sponsoredBadge}>
          <Text style={styles.sponsoredBadgeText}>Patrocinado</Text>
        </View>
        <View style={styles.sponsoredImageContainer}>
          <Image 
            source={{ uri: item.fotos?.[0] ?? 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg' }}
            style={styles.sponsoredImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.sponsoredContent}>
          <Text style={styles.sponsoredTitle} numberOfLines={1}>{item.titulo}</Text>
          <Text style={styles.sponsoredPrice}>${item.precio.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={18} color="#00318D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en MetroMarket..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (search.trim()) {
                router.push({
                  pathname: "../search",
                  params: { query: search }
                });
              }
            }}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Ranking */}
        <TouchableOpacity onPress={() => router.push("../Ranking")} >
          <View style={{top:20, left:20, flexDirection: 'row', alignItems:'center', width: '90%', padding: 10}}> 
              <Ionicons name='trophy' size={25} color="#00318D"/>
              <Text style={styles.seeAllText}>Ranking</Text>
          </View>
        </TouchableOpacity>
          {/* Sección de Patrocinios */}
          {sponsoredPosts.length > 0 && (
            <View style={styles.sponsoredSection}>
              <Carousel
                width={screenWidth * 0.9}
                height={200}
                data={sponsoredPosts}
                renderItem={({ item }) => renderSponsoredItem({ item })}
                autoPlay
                autoPlayInterval={5000}
                loop
                style={{ alignSelf: 'center', marginTop: 10 }}
              />
            </View>
          )}

          {/* Sección de Categorías */}
          <View style={[styles.sectionHeader, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>Explorar categorías</Text>
            <TouchableOpacity onPress={() => setShowAllCategories(!showAllCategories)}>
              <Text style={styles.seeAllText}>{showAllCategories ? 'Ver menos' : 'Ver todas'}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesWrapper}>
            <CategoryBadge
                label={'Todo'}
                imageSource={'https://cdn-icons-png.flaticon.com/512/262/262045.png'}
                isSelected={false}
                onPress={() => router.push({
                  pathname: "./categoria",
                  params: { category: "Todo" }
                })}
              />
            {(showAllCategories ? categorias : categorias.slice(0, 8)).map((cat) => (
              <CategoryBadge
                key={cat._id}
                label={cat.nombre}
                imageSource={cat.foto}
                isSelected={false}
                onPress={() => router.push({
                  pathname: "./categoria",
                  params: { category: cat.nombre }
                })}
              />
            ))}
          </ScrollView>

          {/* Secciones de categorías destacadas */}
          {featuredCategories.map(category => renderCategorySection(category))}

          {/* Mensaje si no hay productos */}
          {publicaciones.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={48} color="#888" />
              <Text style={styles.emptyText}>No hay productos disponibles</Text>
            </View>
          )}
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
    marginTop: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  categoriesWrapper: {
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 160,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
  },
  seeAllText: {
    color: '#00318D',
    fontWeight: '500',
  },
  sponsoredSection: {
    marginTop: 20,
  },
  sponsoredCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginRight: 10,
    height: 200,
  },
  sponsoredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF8C00',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  sponsoredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sponsoredImageContainer: {
    width: '100%',
    height: '70%',
  },
  sponsoredImage: {
    width: '100%',
    height: '100%',
  },
  sponsoredContent: {
    padding: 10,
  },
  sponsoredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sponsoredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00318D',
    marginTop: 5,
  },
  categorySection: {
    marginTop: 20,
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  horizontalProductCard: {
    width: 160,
    marginRight: 12,
  },
  productCardWrapper: {
    width: '48%', // Ocupa casi la mitad del ancho (deja espacio para el margen)
    marginBottom: 16, // Espacio vertical entre cards
  },
});