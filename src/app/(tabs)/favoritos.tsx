import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/userContext'; 
import ProductCard from '../../components/ProductCard';
import { Categoria, Publicacion } from '../../interfaces/types';
import { fetchCategorias } from '../../services/categoriaService';
import { fetchPublicaciones } from '../../services/publicacionService';
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {
    const router = useRouter();
    const { user } = useAuth(); 
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const img = require('../../../assets/images/LogoMetroMarketBN.png');

    useEffect(() => {
        fetchCategorias()
        .then(data => setCategorias(data))
        .catch(console.error);
    }, []);
    
    
    useFocusEffect(
        useCallback(() => {
        if (!user) {
        setPublicaciones([]);
        setMessage("Por favor, inicia sesión para ver tus favoritos.");
        return;
        }
        fetchPublicaciones()
        .then(data => setPublicaciones(data))
        .catch(console.error);
    }, [user?._id]) 
    );

    const favoritosDelUsuario = publicaciones.filter(pub =>
    user?.favoritos?.includes(pub._id)
    );

    const filteredPublications = favoritosDelUsuario.filter((pub) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    const titleMatch = pub.titulo.toLowerCase().includes(searchTerm);
    const categoryMatch = pub.categoria.toLowerCase().includes(searchTerm);
    return titleMatch || categoryMatch;
  });

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
              <Text style={{ color: '#00318D', fontWeight: 'bold'}}>Mis Favoritos</Text>
            </Text>
            <TouchableOpacity>
              <Ionicons name="person-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>

        {/* Productos */}
        { user ? (<ScrollView contentContainerStyle={styles.productsGrid}>
  {filteredPublications.length > 0 ? (
    filteredPublications.map((pub) => (          
    <View style={styles.productCardWrapper} key={pub._id}>
        <ProductCard
          name={pub.titulo}
          price={pub.precio}
          priceTasa={pub.precioTasa}
          formCoin={pub.formaMoneda}
          category={pub.categoria}
          tipo={pub.tipo}
          image={pub.fotos?.[0] ?? 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg'}
          onPress={() => router.push({
          pathname: "/productDetails",
          params: { productId: pub._id }
        })}
        />
      </View>
    ))
  ) : (
    <Text style={styles.errorMensaje}>No tienes productos en favoritos</Text>
  )}
</ScrollView>
) : (
              <ScrollView contentContainerStyle={styles.productsGrid}>
                <View style={styles.emptyContainer}>
                  <Image
                    source={img}
                    style={{ width: 100, height: 100, marginBottom: 16 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>{message}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/login')}
                  >
                    <Text style={styles.addButtonText}>Iniciar sesión</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
        )}
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
    addButton: {
    marginTop: 20,
    backgroundColor: '#00318D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
      emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
      emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    paddingVertical: 16,
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
    paddingTop: 10, 
  },
      productCardWrapper: {
    width: '48%', // Ocupa casi la mitad del ancho (deja espacio para el margen)
    marginBottom: 16, // Espacio vertical entre cards
  },
  errorMensaje: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    textAlign: 'center', 
    width: '100%', 
    marginTop: 20,
  },

});