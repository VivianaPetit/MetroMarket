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
  const  [valor, setValor] = useState(0);
  const  [valor2, setValor2] = useState(0);
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
      setValor2(valor2+ pub.calificacion)
   });
   if (valor2 >= valor){
    setValor(valor2)
    listados.push(id)
   } 
   setValor2(0)
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
   const agregar = promedios.map((bup) => {
     console.log("a")
     const encontrar = categorias.filter(pub => pub._id === bup._id)
     elegidos.push(encontrar[0])
   });
   setBest_sellers(elegidos)
   setPermiso(false)
   console.log(best_sellers)
  }
 }

  const promedio = (ususario: Usuario) => {
   const usuario_resenas = resenas.filter(pub => pub.resenado === ususario._id)
   if (usuario_resenas.length >= 1){ 
   const calculo = usuario_resenas.map((pub) => {
     let a = valor2 + pub.calificacion
      setValor2(a)
   });
   setValor2(valor2/usuario_resenas.length)
   if (valor2 >= valor){
    setValor(valor2)
   const  promeidito = {
    _id: ususario._id,
    promedio: valor2
    }
    promedios.push(promeidito)
   } 
   }
 }

return (
  
  <View style={styles.container}>
  <ScrollView >
    <View style={{flexDirection:'row',gap:15,alignItems:'center'}}>
      <TouchableOpacity onPress={() => router.push('/menu')} >
          <Ionicons name="arrow-back" size={24} color="#00318D" />
    ` </TouchableOpacity>
    <View ><Text style={styles.title}>RANKING BEST SELLER</Text></View>
    </View>

    <View>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: vendedor?.foto }} style={styles.avatarImage} /> //*Aqui va la foto de solo el primer lugar
        <Ionicons name='ribbon' size={60} style={{bottom:10}} ></Ionicons>
      </View>
      <Text style={styles.name}>PEPITA LUISA</Text> //*AQUI VA NOMBRE DEL PRIMER LUGAR
      <Text style={styles.username}>samantha.rojas@correo.unimet.edu.ve</Text>//*AQUI VA correo
      <Text style={styles.username}>04125678903</Text> //*AQUI VA telefono

      
        {best_sellers.map((pub) => (
            <View style={styles.commentContainer}>
                <Text>
                  {pub.nombre}
                </Text>
             <Text>{pub.telefono}</Text>
             <Text>{pub.correo}</Text>
            </View>
              ))}
      
      


    </View>

  </ScrollView>
  </View>
)

      


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