import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { Publicacion } from '../interfaces/types';
import { fetchPublicaciones } from '../services/publicacionService';
import { Ionicons } from '@expo/vector-icons';
import { agregarPublicacionAFavorito, eliminarPublicacionDeFavorito, fetchFavoritoUsuario } from '../services/usuarioService';
import { useAuth } from '../context/userContext';

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, refrescarUsuario } = useAuth();
  const [isLiked, setIsLiked] = useState(false); {/*para el boton de favoritos*/}


  useEffect(() => {
    const loadProduct = async () => {
      try {
        const publicaciones = await fetchPublicaciones();
        const publicacionEncontrada = publicaciones.find(
          (pub) => pub._id === productId
        
        );
        if (!publicacionEncontrada) throw new Error('El producto no existe o fue eliminado');
        setProduct(publicacionEncontrada);
        //busca si ya tiene la publicacion en favoritos
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
   

  }, [productId]);

  // 2do useEffect - Verificación de favoritos
  useEffect(() => {
    const checkFavorite = async () => {
      if (product?._id && user?._id) { // Solo ejecutar si tenemos los IDs necesarios
        try {
          //busca si ya tiene la publicacion en favoritos para definir el color del icono de corazon inicial  
          const favoritoBoolean = await fetchFavoritoUsuario(user._id, product._id);
          setIsLiked(favoritoBoolean);
        } catch (error) {
          console.error('Error al verificar favorito:', error);
        }
      }
    };
    
    checkFavorite();
  }, [product?._id, user?._id]); // Dependencias: se ejecuta cuando product o user cambien

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00318D" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
      </View>
    );
  }


  const handleFavorito = async () => {
    if (!user) {
      Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero para marcar esta publicacion en favoritos');
      return;
    }
    // //busca si ya tiene la publicacion en favoritos para definir el 
    // const favoritoBoolean = await fetchFavoritoUsuario(user._id, product._id);

    if (isLiked == false){ //para agregar el id la publicacion a favoritos
      try{
        //agrega el id de la publicacion a la lista de favoritos del usuario
        await agregarPublicacionAFavorito(user._id, product._id);
        // Refrescar usuario en contexto para obtener datos actualizados
        await refrescarUsuario()

        Alert.alert('¡Éxito!', 'La publicación ha sido añadida a tu lista de favoritos.');
      } catch (error) {
        Alert.alert('Error', 'La publicación no a podido ser añadida a tu lista de favoritos.');
        console.error(error);
      }
      setIsLiked(true)
      console.log('para cargar a la bdd, y colocar like')
    }
    if (isLiked == true){ //para eliminar el id de la publicacion de favoritos
      try{
        //agrega el id de la publicacion a la lista de favoritos del usuario
        await eliminarPublicacionDeFavorito(user._id, product._id);
        // Refrescar usuario en contexto para obtener datos actualizados
        await refrescarUsuario()
        Alert.alert('¡Éxito!', 'La publicación ha sido eliminada de tu lista de favoritos.');
      } catch (error) {
        Alert.alert('Error', 'La publicación no a podido ser eliminada de tu lista de favoritos.');
        console.error(error);
      }
      setIsLiked(false)
      console.log('para eliminar de la bdd, y colocar dislike')
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              product.fotos?.[0] ||
              'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg',
          }}
          style={styles.productImage}
        />
      {/* boton para regresar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* boton de favoritos */}
        <TouchableOpacity style={styles.heartButton} onPress={handleFavorito}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={26} color={isLiked ? "#ff0000" : "#fff"}/>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>

        <Text style={styles.titleText}>{product.titulo}</Text>

        <Text style={styles.priceText}>${product.precio}</Text>

        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.descriptionText}>{product.descripcion}</Text>

        <Text style={styles.sectionLabel}>Cantidad disponible</Text>
        <Text style={styles.detailText}>{product.cantidad}</Text>

        <Text style={styles.sectionLabel}>Estado</Text>
        <Text style={styles.badge}>{product.estado}</Text>

        <Text style={styles.sectionLabel}>Método de pago</Text>
        <Text style={styles.detailText}>{product.metodoPago}</Text>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
  },
  titleText: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
  heartButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
  detailsContainer: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F0FF',
    color: '#00318D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 16,
  },
  buyButton: {
    backgroundColor: '#00318D',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
