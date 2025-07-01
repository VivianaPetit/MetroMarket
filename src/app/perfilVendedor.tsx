import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchUsuarioById } from '../services/usuarioService';
import { fetchPublicaciones } from '../services/publicacionService';
import { fetchResena } from '../services/ResenaServices';
import ProductCard from '../components/ProductCard';
import CommentCard from '../components/CommentCard';
import ProfileCard from '../components/ProfileCard';
import { Usuario, Publicacion, Resena} from '../interfaces/types';
import { Ionicons } from '@expo/vector-icons';

// Placeholder image for empty state
const img = { uri: 'https://via.placeholder.com/100?text=No+Image' };

export default function PerfilVendedor() {
  const { vendedorId } = useLocalSearchParams();
  const [vendedor, setVendedor] = useState<Usuario | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuarioData, publicacionesData, resenasData] = await Promise.all([
          fetchUsuarioById(typeof vendedorId === 'string' ? vendedorId : vendedorId?.[0] || ''),
          fetchPublicaciones(),
          fetchResena()
        ]);

        setVendedor(usuarioData);
        setPublicaciones(publicacionesData.filter(p => p.usuario === vendedorId));
        setResenas(resenasData.filter(r => r.resenado === vendedorId));
      } catch (error) {
        console.error('Error cargando perfil del vendedor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (vendedorId) fetchData();
  }, [vendedorId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00318D" />
        <Text style={{ marginTop: 10 }}>Cargando perfil del vendedor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00318D" />
        </TouchableOpacity>

      <ProfileCard
        UserName={vendedor?.correo}
        nombreyA={vendedor?.nombre ?? 'Usuario'}
        tlf={vendedor?.telefono ?? ''}
        foto={vendedor?.foto}
      />

            {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'publicaciones' && styles.activeTab]}
              onPress={() => setActiveTab('publicaciones')}
            >
              <Ionicons 
                name="grid" 
                size={24} 
                color={activeTab === 'publicaciones' ? '#00318D' : '#888'} 
              />
              <Text style={[styles.tabText, activeTab === 'publicaciones' && styles.activeTabText]}>
                Publicaciones
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'reseñas' && styles.activeTab]}
              onPress={() => setActiveTab('reseñas')}
            >
              <Ionicons 
                name="chatbubbles" 
                size={24} 
                color={activeTab === 'reseñas' ? '#00318D' : '#888'} 
              />
              <Text style={[styles.tabText, activeTab === 'reseñas' && styles.activeTabText]}>
                Reseñas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contenido de Tabs */}
          {activeTab === 'publicaciones' ? (
  <View style={styles.publicacionesContainer}>
    {publicaciones.length > 0 ? (
      <View style={styles.productsGrid}>
        {publicaciones.map((item) => (
          <View key={item._id} style={styles.productWrapper}>
            <ProductCard
              image={item.fotos && item.fotos.length > 0 ? item.fotos[0] : 'https://via.placeholder.com/150'}
              name={item.titulo}
              price={item.precio}
              priceTasa={item.precioTasa}
              formCoin={item.formaMoneda}
              category={item.categoria}
              tipo={item.tipo}
              onPress={() => router.push({
                pathname: "/productDetails",
                params: { productId: item._id }
              })}
            />
          </View>
        ))}
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <Image
          source={img}
          style={{ width: 100, height: 100, marginBottom: 16 }}
          resizeMode="contain"
         // onLoadStart={() => setIsUploading(true)}
        //  onLoadEnd={() => setIsUploading(false)}
        />
        {/*isUploading && <ActivityIndicator size="small" color="#00318D" />*/}
        <Text style={styles.emptyText}>Este usuario no tiene publicaciones aún</Text>
      </View>
    )}
  </View>
) : (
      <View style={styles.commentsContainer}>
        {resenas && resenas.filter(r => r.comentario?.trim())
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 10)
          .map((comentario) => (
            <CommentCard
              key={comentario._id}
              commentText={comentario.comentario}
              fecha={typeof comentario.fecha === 'string' ? comentario.fecha : new Date(comentario.fecha).toISOString()}
              calificacion={comentario.calificacion}
            />
          ))
        }
        {resenas.filter(r => r.comentario?.trim()).length === 0 && (
          <Text style={styles.emptyText}>Este usuario no tiene reseñas aún</Text>
        )}
      </View> 
          )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: '#00318D',
    fontWeight: '600',
  },
    publicacionesContainer: {
    marginTop: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  phone: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noReviews: {
    color: '#777',
    textAlign: 'center',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
    commentsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#00318D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  productWrapper: {
    width: '48%', // Deja un 4% de espacio entre elementos
    marginBottom: 12,
  },
    tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginTop: 20,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00318D',
  },
  tabText: {
    marginLeft: 8,
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#00318D',
  },
}); 
