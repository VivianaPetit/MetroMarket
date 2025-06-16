import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
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
            {/* <TouchableOpacity 
                onPress={() => router.push('/menu')}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={24} color="#00318D" />
            </TouchableOpacity> */}
            <Text style={styles.headerTitle}>
              <Text style={{ color: '#00318D', fontWeight: 'bold'}}>Mis Favoritos</Text>
            </Text>
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/perfil')}>
              <Ionicons name="person-outline" size={24} color="#00318D" />
            </TouchableOpacity>
        </SafeAreaView>

        {/* Productos */}
        { user ? (<ScrollView contentContainerStyle={styles.productsGrid}>
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
            <Text style={styles.errorMensaje}>No tienes productos en favoritos</Text>
            )}
            </View>
        </ScrollView>) : (
          <Text style={styles.errorMensaje}>{message}</Text>
          
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
    alignItems: 'center',
    justifyContent: 'flex-end',//space between si tiene botond regreso
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerIcon: {
    paddingLeft: 10,
    paddingBottom: 20,
    marginLeft: 80,//sin esto si se incluye el boton de regreso
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