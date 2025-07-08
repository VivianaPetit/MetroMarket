import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Image, ActivityIndicator, FlatList } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/userContext'; 
import { editarUsuario } from '../services/usuarioService';
import React, { useState, useEffect, useCallback } from 'react';
import CommentCard from '../components/CommentCard';
import { Resena, Publicacion } from '../interfaces/types';
import { fetchResena } from '../services/ResenaServices';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../supabase';
import { fetchPublicaciones } from '../services/publicacionService';
import ProductCard from '../components/ProductCard';
import { checkUserVerificationStatus } from '../services/usuarioService';

export default function Perfil() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [publicacionesUsuario, setPublicacionesUsuario] = useState<Publicacion[]>([]);
  const router = useRouter();
  const { user, logout, setUser } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [colorMensaje, setColorMensaje] = useState('green');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre ?? '');
  const [telefono, setTelefono] = useState(user?.telefono ?? '');
  const [Resenas, setResenas] = useState<Resena[]>([]);
  const [Resenas2, setResenas2] = useState<Resena[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('publicaciones'); // 'publicaciones' o 'reseñas'
  const img = require('../../assets/images/LogoMetroMarketBN.png');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchResena();
        setResenas(data);
        setResenas2(data.filter(resena => resena.usuario && resena.resenado === user?._id));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user?._id]);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (user?._id) {
        try {
          const verified = await checkUserVerificationStatus(user._id);
          setIsVerified(verified);
        } catch (error) {
          console.error("Error fetching verification status:", error);
        }
      }
    };

    fetchVerificationStatus();
  }, [user]);


  useFocusEffect(
  useCallback(() => {
    if (!user) {
      setPublicaciones([]);
      setPublicacionesUsuario([]);
      return;
    }
    
    fetchPublicaciones()
      .then(data => {
        setPublicaciones(data);
        // Filtra las publicaciones del usuario actual
        const publicacionesDelUsuario = data.filter(pub => 
          user.publicaciones?.includes(pub._id) && pub.eliminado === false
        );
        setPublicacionesUsuario(publicacionesDelUsuario);
      })
      .catch(console.error);
  }, [user?._id])
);

  const pickImage = async () => {
    if (!modoEdicion || !user) return;
    
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Necesitamos acceso a tu galería para cambiar la foto de perfil');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!user) return;
    
    setIsUploading(true);
    try {
      // Leer y procesar la imagen
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error('El archivo no existe');

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Subir a Supabase
      // Generar un nombre único para la foto usando timestamp
      const timestamp = Date.now();
      const filename = `profile-${user._id}-${timestamp}.jpg`;
      const { error } = await supabase.storage
        .from('usuarios')
        .upload(filename, bytes, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '3600'
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('usuarios')
        .getPublicUrl(filename);
      
      // Actualizar usuario
      const usuarioActualizado = await editarUsuario(user._id, { 
        nombre,
        telefono,
        foto: publicUrl
      });

      setUser(usuarioActualizado);
      setMensaje('Perfil actualizado correctamente');
      setColorMensaje('green');
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al actualizar la foto');
      setColorMensaje('red');
    } finally {
      setIsUploading(false);
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const handleGuardar = async () => {
    if (!user) return;
    
    try {
      const usuarioActualizado = await editarUsuario(user._id, { 
        nombre, 
        telefono,
        foto: user.foto // Mantener la foto existente
      });
      
      setUser(usuarioActualizado);
      setModoEdicion(false);
      setMensaje('Perfil actualizado exitosamente');
      setColorMensaje('green');
    } catch (error) {
      setMensaje('Error al actualizar el perfil');
      setColorMensaje('red');
    } finally {
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const handleLogout = () => {
    logout?.();
    router.replace('/');
  };
  const renderPublicacion = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.publicacionItem}>
      <Image source={{ uri: item.imagen }} style={styles.publicacionImagen} />
      <View style={styles.publicacionInfo}>
        <Text style={styles.publicacionTitulo} numberOfLines={1}>{item.titulo}</Text>
        <Text style={styles.publicacionPrecio}>{item.precio}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="#00318D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity 
          onPress={() => setModoEdicion(!modoEdicion)}
          disabled={isUploading}
        >
          <Ionicons 
            name={modoEdicion ? "close" : "create"} 
            color="#00318D" 
            size={24} 
          />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <ProfileCard
        UserName={user?.correo ?? 'Usuario'}
        nombreyA={modoEdicion ? nombre : user?.nombre ?? 'Nombre'}
        tlf={modoEdicion ? telefono : user?.telefono ?? ''}
        foto={user?.foto}
        editable={modoEdicion}
        onNombreChange={setNombre}
        onTelefonoChange={setTelefono}
        onFotoChange={pickImage}
        isUploading={isUploading}
        isVerified={isVerified}
      />

      {mensaje !== '' && (
        <Text style={[styles.message, { color: colorMensaje }]}>
          {mensaje}
        </Text>
      )}

      {modoEdicion ? (
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleGuardar}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      ) : (
        <>
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
    {publicacionesUsuario.length > 0 ? (
      <View style={styles.productsGrid}>
        {publicacionesUsuario.map((item) => (
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
        <Text style={styles.emptyText}>No tienes publicaciones</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/formularioPublicar')}
        >
          <Text style={styles.addButtonText}>Crear primera publicación</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
) : (
      <View style={styles.commentsContainer}>
        {Resenas2 && Resenas2.filter(r => r.comentario?.trim())
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 8)
          .map((comentario) => (
            <CommentCard
              key={comentario._id}
              commentText={comentario.comentario}
              fecha={typeof comentario.fecha === 'string' ? comentario.fecha : new Date(comentario.fecha).toISOString()}
              calificacion={comentario.calificacion}
            />
          ))
        }
        {Resenas2.filter(r => r.comentario?.trim()).length === 0 && (
          <Text style={styles.emptyText}>No hay reseñas todavía</Text>
        )}
      </View> 
          )}

          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out" color="#00318D" size={20} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00318D',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  buttonTextAlt: {
    color: '#F68628',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  logoutText: {
    color: '#00318D',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
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
  message: {
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    paddingVertical: 16,
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
  publicacionesContainer: {
    marginTop: 10,
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
  publicacionItem: {
    width: '49%',
    aspectRatio: 1,
    marginBottom: 2,
    backgroundColor: '#FFF',
  },
  publicacionImagen: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  publicacionInfo: {
    padding: 8,
    backgroundColor: '#FFF',
  },
  publicacionTitulo: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  publicacionPrecio: {
    fontSize: 16,
    color: '#00318D',
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
});

