/*import React, { useEffect, useState, useCallback } from 'react';
import { useRouter} from 'expo-router';
import { fetchUsuarios } from '../services/usuarioService';
import { fetchResena } from '../services/ResenaServices';
import {Usuario, Resena, Promedio} from '../interfaces/types';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { BounceIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function Ranking() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Usuario[]>([]);
  const [elegidos, setElegidos] = useState<Usuario[]>([]);
  const [vendedor, setVendedor] = useState<Usuario>();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [resenas2, setResenas2] = useState<Resena[]>([]);
  const [promedios, setPromedios] = useState<Promedio[]>([]);
  const [listados, setlistados] = useState<string[]>([]);
  const [best_sellers, setBest_sellers] = useState<Usuario[]>([]);
  const  [valor, setValor] = useState<number>(0);
  var  valor2  = 0;
    const [permiso, setPermiso] = useState(true);

     useEffect(() => {
        fetchUsuarios()
          .then(data => {
            setCategorias(data);
          })
          .catch(console.error);
         fetchResena()
          .then(data => {
            setResenas(data);
          })
          .catch(console.error);     
      }, []);

      
 useEffect(() => {
    clasificacion
  },  []);

 const promediar = (id: string) => {
   const usuario_resenas = resenas.filter(pub => pub.resenado === id)
   if (usuario_resenas.length >= 1){ 
   const calculo = usuario_resenas.map((pub) => {
      valor2 = valor2+ pub.calificacion
   });
   if (valor2 >= valor){
    setValor(valor2)
    listados.push(id)
   } 
   valor2 = 0
   }
 }
  
 const escoger = () => {  
  const promedio = categorias.map((pub) => {
    promediar(pub._id)
   });
   if (listados.length > 1){ 
    const agregar_listados = listados.map((bup) => {
    const Vendedores_elegidos = categorias.filter(pub => pub._id === bup)
    elegidos.push(Vendedores_elegidos[0])
   });
    const comparacion = elegidos.map((pub) => {
     if(pub.publicaciones.length > valor){
      setValor(pub.publicaciones.length)
      //setVendedor(pub)
     }
   });
   }else{
    const Vendedor_elegido = categorias.filter(pub => pub._id === listados[0])
    //setVendedor(Vendedor_elegido[0])
    }
    setlistados([])
    setElegidos([])
    setValor(0)
    console.log(vendedor) 
 }

 const clasificacion = async() => {
   if(permiso){
   const quitar_primero = categorias.map((bup) => {
    promedio(bup)
   });
   var a = 1
   const agregar = promedios.map((bup) => {
     if (bup.promedio < promedios[a].promedio && a <= promedios.length-1){ 
     const encontrar = categorias.filter(pub => pub._id ===  promedios[a]._id)
     console.log(encontrar)
     elegidos.push(encontrar[0])
     const encontrar2 = categorias.filter(pub => pub._id === bup._id)
     elegidos.push(encontrar2[0])
     }else{ 
       const encontrar = elegidos.filter(pub => pub._id === bup._id)
       if (encontrar.length <= 0){
             const encontrar = categorias.filter(pub => pub._id === bup._id)
             elegidos.push(encontrar[0])
       }
     }
   });
   
   setBest_sellers(elegidos)
   setPermiso(false)
   console.log(promedios)
  }
 }

  const promedio = (ususario: Usuario) => {
   const usuario_resenas = resenas.filter(pub => pub.resenado === ususario._id)
   if (usuario_resenas.length >= 1){ 
   const calculo = usuario_resenas.map((pub) => {
     valor2 = valor2 + pub.calificacion
      //console.log(valor2)
   });
   valor2 = valor2/usuario_resenas.length
   console.log(valor2)
    setValor(valor2)
   const  promeidito = {
    _id: ususario._id,
    promedio: valor2 }
    promedios.push(promeidito)
   } 
   }


return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.horizontalScroll}>
            <View style={styles.productCardWrapper}>
             <Text>Vendedor del mes</Text>
              <Text>
                  {vendedor?.nombre}
                </Text>
             <Text>{vendedor?.telefono}</Text>
             <Text>{vendedor?.correo}</Text>
             {best_sellers.map((pub) => (
            <View style={styles.productCardWrapper}>
                <Text>
                  {pub.nombre}
                </Text>
             <Text>{pub.telefono}</Text>
             <Text>{pub.correo}</Text>
            </View>
              ))}
             <TouchableOpacity onPress={clasificacion} style={styles.backButton}>Ver vendedores del mes</TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
  };

const styles = StyleSheet.create({
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  categoriesWrapper: {
    marginTop: 12,
    paddingLeft: 16,
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
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
   container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },title: {
    fontSize:20, 
    fontWeight: 'bold',
    color: '#333',

  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#00318D',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    marginTop:30
  },
  avatarImage: { // <-- AÑADE ESTE ESTILO
    width: '100%',
    height: '100%',
    borderRadius: 100, // Para que la imagen también sea redonda
  },
   name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop:25,
    marginRight:10,
    alignSelf:'center'
  },
  card: {
    flexDirection:'column',
    backgroundColor: 'gray',
    

  },
  username: {
    fontSize: 16,
    color: '#666',
    marginRight:10,
    alignSelf:'center'
  },
  commentContainer: {
    backgroundColor: '#F6F6F6',
    padding: 8,
    borderRadius: 5,
    maxWidth: '90%',
    marginTop:30
  },

}) */