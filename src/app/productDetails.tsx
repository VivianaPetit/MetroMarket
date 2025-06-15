import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Publicacion, Usuario } from '../interfaces/types';
import { fetchPublicaciones } from '../services/publicacionService';
import { Ionicons } from '@expo/vector-icons';
import { fetchUsuarioById } from '../services/usuarioService';
import { agregarPublicacionAFavorito, eliminarPublicacionDeFavorito, fetchFavoritoUsuario } from '../services/usuarioService';
import { useAuth } from '../context/userContext';

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendedor, setVendedor] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [recomendadasCat, setRecomendadasCat] = useState<Publicacion[]>([]);
  const [recomendadasVend, setRecomendadasVend] = useState<Publicacion[]>([]);
  const router = useRouter();
  const { user, refrescarUsuario } = useAuth();
  const [isLiked, setIsLiked] = useState(false); {/*para el boton de favoritos*/}


  useEffect(() => {
    const loadProductAndRecomendadas = async () => {
      try {
        const publicaciones = await fetchPublicaciones();
        const publicacionEncontrada = publicaciones.find(pub => pub._id === productId);
        if (!publicacionEncontrada) throw new Error('Producto no encontrado');

        console.log(publicacionEncontrada.usuario)
        const user = await fetchUsuarioById(publicacionEncontrada.usuario);
        setVendedor(user);
        setProduct(publicacionEncontrada);

        // Filtrar otras publicaciones de la misma categoría excepto la actual
        const otras = publicaciones.filter(
          (p) => p.categoria === publicacionEncontrada.categoria && p._id !== publicacionEncontrada._id
        );
        setRecomendadasCat(otras.slice(0, 3)); // Mostrar máximo 3 recomendadas

        // Filtrar otras publicaciones del mismo vendedor excepto la actual
        const otrasVend = publicaciones.filter(
          (p) => p.usuario === publicacionEncontrada.usuario && p._id !== publicacionEncontrada._id
        );
        setRecomendadasVend(otrasVend.slice(0, 3)); // Mostrar máximo 3 recomendadas

      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProductAndRecomendadas();
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


  const handlePreguntar = () => {
    if (!nuevaPregunta.trim()) return;
    Alert.alert('Pregunta enviada', 'Tu pregunta ha sido enviada al vendedor.');
    setNuevaPregunta('');
    // Aquí deberías enviar la pregunta al backend
  };

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  //para marcar como favorito
  const handleFavorito = async () => {
    if (!user) {
      Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero para marcar esta publicacion en favoritos');
      return;
    }

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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#F68628" />
        </TouchableOpacity>
        {/* boton para regresar */}
        <TouchableOpacity onPress={() => router.push(`/`)}>
          <Text style={styles.linkText}>Ver más productos de la categoría "{product.categoria}"</Text>
        </TouchableOpacity>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: product.fotos?.[0] || 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg',
          }}
          style={styles.productImage}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          {/* boton de favoritos */}
                  <Text style={styles.titleText}>{product.titulo} </Text>
                  <TouchableOpacity onPress={handleFavorito}>
                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color="#F68628" />
                  </TouchableOpacity>
                </View>
        <Text style={styles.priceText}>US$ {product.precio}</Text>

        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.descriptionText}>{product.descripcion}</Text>

        <Text style={styles.sectionLabel}>Cantidad disponible</Text>
        <Text style={styles.detailText}>{product.cantidad}</Text> 

        <Text style={styles.sectionLabel}>Estado</Text>
        <Text style={styles.badge}>{product.estado}</Text>

        <Text style={styles.sectionLabel}>Método de pago</Text>
        <Text style={styles.detailText}>{product.metodoPago}</Text>

        <Text style={styles.sectionLabel}>Vendedor</Text>
        <Text style={styles.detailText}>
          {vendedor ? `${vendedor.nombre} - ${vendedor.telefono}` : 'Cargando...'}
        </Text>

        <TouchableOpacity style={styles.buyButton} onPress={() => router.push({
          pathname: "/comprar",
          params: { productId: productId } // 🔄 Envías el mismo ID a la pantalla de compra
        })} >
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>

        {/* SECCIÓN DE RECOMENDADAS POR CATEGORÍA */}
        {recomendadasCat.length > 0 && (
          <>
            <View style={styles.separador} />
            <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Publicaciones recomendadas</Text>
            {recomendadasCat.map((rec) => (
              <TouchableOpacity
                key={rec._id}
                style={styles.recomendadaItem}
                onPress={() => router.push(`/`)}
              >
                <Image
                  source={{ uri: rec.fotos?.[0] || 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg' }}
                  style={styles.recomendadaImage}
                />
                <View style={styles.recomendadaInfo}>
                  <Text style={styles.recomendadaTitle} numberOfLines={1}>
                    {rec.titulo}
                  </Text>
                  <Text style={styles.recomendadaPrice}>${rec.precio}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
        {/* SECCIÓN DE RECOMENDADAS POR VENDEDOR */}
        {recomendadasVend.length > 0 && (
          <>
            <View style={styles.separador} />
            <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Más productos del vendedor</Text>
            {recomendadasVend.map((rec) => (
              <TouchableOpacity
                key={rec._id}
                style={styles.recomendadaItem}
                onPress={() => router.push(`/`)}
              >
                <Image
                  source={{ uri: rec.fotos?.[0] || 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg' }}
                  style={styles.recomendadaImage}
                />
                <View style={styles.recomendadaInfo}>
                  <Text style={styles.recomendadaTitle} numberOfLines={1}>
                    {rec.titulo}
                  </Text>
                  <Text style={styles.recomendadaPrice}>${rec.precio}</Text>
                </View>
              </TouchableOpacity>
            ))}
        <View style={styles.separador} />
        <Text style={styles.sectionLabel}>Preguntas</Text>
        {product.preguntas?.length > 0 ? (
          product.preguntas.map((p, index) => (
            <Text key={index} style={styles.questionText}>
              • {p}
            </Text>
          ))
        ) : (
          <Text style={styles.detailText}>No hay preguntas aún.</Text>
        )}

        <Text style={styles.sectionLabel}>Haz una pregunta</Text>
        <TextInput
          placeholder="Escribe tu pregunta..."
          value={nuevaPregunta}
          onChangeText={setNuevaPregunta}
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handlePreguntar}>
          <Text style={styles.buyButtonText}>Enviar</Text>
        </TouchableOpacity>
          </>
        )}
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
  imageWrapper: {
    position: 'relative',
  },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 450,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 13,
    padding: 6,
  },
  heartButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
  detailsContainer: {
    padding: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111',
  },
  priceText: {
    fontSize: 22,
    color: 'green',
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    color: '#444',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    marginBottom: 8,
    color: '#444',
  },
  badge: {
    backgroundColor: '#E6F0FF',
    color: '#00318D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#00318D',
    fontWeight: '600',
    marginTop: 70,
    marginBottom: 8,
    marginHorizontal: 20,
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  questionText: {
    fontSize: 15,
    marginBottom: 8,
    color: '#222',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#F68628',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#F68628',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  recomendadaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recomendadaImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  recomendadaInfo: {
    flex: 1,
  },
  recomendadaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  recomendadaPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
    separador: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
});
