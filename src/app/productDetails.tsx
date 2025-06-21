import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Publicacion, Usuario } from '../interfaces/types';
import { fetchPublicaciones } from '../services/publicacionService';
import { fetchUsuarioById, agregarPublicacionAFavorito, eliminarPublicacionDeFavorito, fetchFavoritoUsuario } from '../services/usuarioService';
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
  const [isLiked, setIsLiked] = useState(false);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  

  const incrementarCantidad = () => {
    if (product && cantidadSeleccionada < product.cantidad) {
      setCantidadSeleccionada(cantidadSeleccionada + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidadSeleccionada > 1) {
      setCantidadSeleccionada(cantidadSeleccionada - 1);
    }
  };

  useEffect(() => {
    const loadProductAndRecomendadas = async () => {
      try {
        if (typeof productId !== 'string') {
          setError('ID de producto inválido.');
          setLoading(false);
          return;
        }

        const publicaciones = await fetchPublicaciones();
        const publicacionEncontrada = publicaciones.find(pub => pub._id === productId);
        if (!publicacionEncontrada) throw new Error('Producto no encontrado');

        const user = await fetchUsuarioById(publicacionEncontrada.usuario);
        setVendedor(user);
        setProduct(publicacionEncontrada);

        const otras = publicaciones.filter(
          (p) => p.categoria === publicacionEncontrada.categoria && p._id !== publicacionEncontrada._id
        );
        setRecomendadasCat(otras.slice(0, 3));

        const otrasVend = publicaciones.filter(
          (p) => p.usuario === publicacionEncontrada.usuario && p._id !== publicacionEncontrada._id
        );
        setRecomendadasVend(otrasVend.slice(0, 3));

      } catch (err) {
        console.error("Error al cargar producto o recomendadas:", err);
        setError('Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    loadProductAndRecomendadas();
  }, [productId]);
  
  //Verifica si el profucto ha sido marcado como favorito anteriormente para mostrarlo activando el icono de corazon
  useEffect(() => {
    const checkFavorite = async () => {
      if (product?._id && user?._id) {
        try {
          const favoritoBoolean = await fetchFavoritoUsuario(user._id, product._id);
          setIsLiked(favoritoBoolean);
        } catch (error) {
          console.error('Error al verificar favorito:', error);
        }
      }
    };
    checkFavorite();
  }, [product?._id, user?._id]);

  const handleComprar = () => {
  if (!user) {
    Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero.');
    return;
  }
};

  const handlePreguntar = () => {
    if (!nuevaPregunta.trim()) return;
    Alert.alert('Pregunta enviada', 'Tu pregunta ha sido enviada al vendedor.');
    setNuevaPregunta('');
  };

  const Verificacion_Usuario = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push({
        pathname: "/comprar",
        params: { 
          productId: productId,
          cantidad: cantidadSeleccionada.toString()
        }
      });
      console.log('La cantidad mandada fue: ',cantidadSeleccionada)
    }
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F68628" />
        <Text style={{ marginTop: 10, color: '#555' }}>Cargando producto...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="red" />
        <Text style={styles.errorText}>{error || 'Producto no encontrado.'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  //para favoritos
  const handleFavorito = async () => {
    if (!user) {
      Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero.');
      return;
    }
    
    try {
      if (!isLiked) {
        await agregarPublicacionAFavorito(user._id, product._id);
        await refrescarUsuario();
        setIsLiked(true);
      } else {
        await eliminarPublicacionDeFavorito(user._id, product._id);
        await refrescarUsuario();
        setIsLiked(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <SafeAreaView>
        <TouchableOpacity 
          onPress={() => router.push('/')}
          style={styles.backButton}
        >
        <Ionicons name="arrow-back" size={24} color="#00318D" />
          </TouchableOpacity> 
        </SafeAreaView>

    <View style={{ marginTop: 20 }}>
      <TouchableOpacity onPress={() => router.push({
        pathname: "/",
        params: { categoria: product.categoria }
      })}>
        <Text style={styles.linkText}>
          Ver más productos de la categoría "{product.categoria}"
        </Text>
      </TouchableOpacity>
    </View>


    {/* visualizacion imagen */}
      <View style={styles.imageWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {(product.fotos?.length ? product.fotos : ['https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg'])
            .map((foto, index) => (
              <Image
                key={index}
                source={{ uri: foto }}
                style={styles.productImage}
              />
            ))
          }
        </ScrollView>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.titleText}>{product.titulo}</Text>
          <TouchableOpacity onPress={handleFavorito}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color="#F68628" />
          </TouchableOpacity>
        </View>

        {/* visualizacion precio */}
        <Text style={styles.priceText}>
          {product.tipo === 'producto' ? 'US$' : 'US$/hora  '}
          {product.precio}
        </Text>

        {/* visualizacion descripcion */}
        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.descriptionText}>{product.descripcion}</Text>

        {/* visualizacion cantidad */}
        {product.tipo === 'producto' && (
          <>
            <Text style={styles.sectionLabel}>
              Cantidad disponible: {product.cantidad}
            </Text>
            <View style={styles.cantidadContainer}>
              <TouchableOpacity 
                onPress={decrementarCantidad}
                style={[
                  styles.cantidadButton,
                  cantidadSeleccionada <= 1 && styles.cantidadButtonDisabled
                ]}
                disabled={cantidadSeleccionada <= 1}
              >
                <Text style={styles.cantidadButtonText}>-</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.cantidadInput}
                value={cantidadSeleccionada.toString()}
                editable={false}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  if (num > 0 && num <= (product?.cantidad || 1)) {
                    setCantidadSeleccionada(num);
                  }
                }}
                keyboardType="numeric"
              />
              
              <TouchableOpacity 
                onPress={incrementarCantidad}
                style={[
                  styles.cantidadButton,
                  cantidadSeleccionada >= (product?.cantidad || 1) && styles.cantidadButtonDisabled
                ]}
                disabled={cantidadSeleccionada >= (product?.cantidad || 1)}
              >
                <Text style={styles.cantidadButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* visualizacion Estado(para producto) || modalidad(para servicio) */}
        {product.tipo == 'producto' ? (
          // visualizacion de Estado(para producto)
          <View>
            <Text style={styles.sectionLabel}>Estado</Text>
            <Text style={styles.badge}>{product.estado}</Text>
          </View>
        ) : (
          // visualizacion de modalidad(para servicio)
          <View>
            <Text style={styles.sectionLabel}>Modalidad del servicio</Text>
            <Text style={styles.badge}>{product.modalidad}</Text>
          </View>        
        )}

        {/* visualizacion nada(para producto) || horario(para servicio) */}
        {product.tipo == 'producto' ? (
          // visualizacion de Estado(para producto)
          <View>
            <Text style={styles.sectionLabel}>Estado</Text>
          </View>
        ) : (
          // visualizacion de modalidad(para servicio)
          <View>
            <Text style={styles.sectionLabel}>Horario de disponibilidad</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {Object.entries(product.horario).map(([dia, valor]) => {
                if (valor.includes('true')) {
                  return (
                    <Text key={dia} style={styles.badge}>
                      {dia} 
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          </View>        
        )}

        
        <Text style={styles.sectionLabel}>Método de pago</Text>
        <Text style={styles.detailText}>{product.metodoPago}</Text>

        <Text style={styles.sectionLabel}>Vendedor</Text>
        <Text style={styles.detailText}>{vendedor ? `${vendedor.nombre} - ${vendedor.telefono}` : 'Cargando...'}</Text>

        <TouchableOpacity style={styles.buyButton} onPress={Verificacion_Usuario} >
          <Text style={styles.buyButtonText}>
            {product.tipo === 'producto' ? 'Comprar' : 'Reservar'}
          </Text>
        </TouchableOpacity>

        {recomendadasCat.length > 0 ? (
          <>
            <View style={styles.separador} />
            <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Publicaciones recomendadas</Text>
            {recomendadasCat.map((rec) => (
              <TouchableOpacity key={rec._id} style={styles.recomendadaItem} onPress={() => router.push({
                        pathname: "/productDetails",
                        params: { productId: rec._id }
                    })}>
                <Image source={{ uri: rec.fotos?.[0] || 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg' }} style={styles.recomendadaImage} />
                <View style={styles.recomendadaInfo}>
                  <Text style={styles.recomendadaTitle} numberOfLines={1}>{rec.titulo}</Text>
                  <Text style={styles.recomendadaPrice}>${rec.precio}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : null}

        {recomendadasVend.length > 0 ? (
          <>
            <View style={styles.separador} />
            <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Más productos del vendedor</Text>
            {recomendadasVend.map((rec) => (
              <TouchableOpacity key={rec._id} style={styles.recomendadaItem} onPress={() => router.push({
                        pathname: "/productDetails",
                        params: { productId: rec._id }
                    })}>
                <Image source={{ uri: rec.fotos?.[0] || 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg' }} style={styles.recomendadaImage} />
                <View style={styles.recomendadaInfo}>
                  <Text style={styles.recomendadaTitle} numberOfLines={1}>{rec.titulo}</Text>
                  <Text style={styles.recomendadaPrice}>${rec.precio}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : null}
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
    width: '100%',
    height: 450, // o el alto que desees para las imágenes
  },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productImage: {
    width: Dimensions.get('screen').width,
    height: 450,
    resizeMode: 'contain',
    backgroundColor: 'white'
  },

  backButton: {
    position: 'absolute',
    top: 15,
    left: 13,
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
    marginRight: 5,
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
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    minHeight: 40,
    textAlignVertical: 'top',
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
  errorContainer: { // Estilos para el contenedor de error
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorButton: { // Estilos para el botón de error
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
   errorButtonText: { // Estilos para el texto del botón de error
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cantidadContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 5,
},
cantidadButton: {
  backgroundColor: '#F68628',
  width: 30,
  height: 30,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
cantidadButtonDisabled: {
  backgroundColor: '#cccccc',
},
cantidadButtonText: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
  alignSelf: 'center'
},
cantidadInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 10,
  marginHorizontal: 10,
  width: 70,
  textAlign: 'center',
  fontSize: 16,
},
});