import React, { useEffect, useState, useCallback } from 'react';
import { useRouter} from 'expo-router';
import { fetchUsuarios } from '../services/usuarioService';
import { fetchResena } from '../services/ResenaServices';
import {Usuario, Resena, Promedio} from '../interfaces/types';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { BounceIn } from 'react-native-reanimated';
import { Ionicons, Octicons } from '@expo/vector-icons';

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
  const [valor, setValor] = useState<number>(0);
  var valor2 = 0;
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
    escoger();
  }, []);

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
  
 const escoger = async() => {  
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
      setVendedor(pub)
     }
   });
   }else{
    const Vendedor_elegido = categorias.filter(pub => pub._id === listados[0])
    setVendedor(Vendedor_elegido[0])
    }
    setlistados([])
    setElegidos([])
    setValor(0)
    clasificacion
 }

 const clasificacion = async() => {
   if(permiso){
   const quitar_primero = categorias.map((bup) => {
    promedio(bup)
   });
    var a = 0
   //console.log(promedios)
   const agregar = promedios.slice(1).map((bup) => {
     if (bup.promedio > promedios[a].promedio && a <= promedios.length-1){
       const encontrar3 = elegidos.filter(pub => pub._id === bup._id) 
       if (encontrar3.length <= 0){
     const encontrar = categorias.filter(pub => pub._id ===  bup._id)
     //console.log(encontrar)
     elegidos.unshift(encontrar[0])
     }
     const encontrar2 = categorias.filter(pub => pub._id === promedios[a]._id)
     elegidos.push(encontrar2[0])
     }else{ 
       const encontrar = elegidos.filter(pub => pub._id === bup._id)
       elegidos.push(encontrar[0])
       }
     a = a+1
     //console.log(a)
   });
   setBest_sellers(elegidos)
   setPermiso(false)
    setElegidos([])
   setPromedios([])
   //console.log(best_sellers)
  }
 }

  const promedio = (ususario: Usuario) => {
   const usuario_resenas = resenas.filter(pub => pub.resenado === ususario._id)
   if (usuario_resenas.length >= 1){ 
   const calculo = usuario_resenas.map((pub) => {
       valor2 = valor2 + pub.calificacion

   });
   valor2 = valor2/usuario_resenas.length
   //console.log(valor2)
   
    setValor(valor2)
   const  promeidito = {
    _id: ususario._id,
    promedio: valor2
    }
    promedios.push(promeidito) 
   }
 }

 return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{flexDirection:'row', gap:15, alignItems:'center', marginBottom: 20, marginHorizontal: 50}}>
          <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name="arrow-back" size={24} color="#00318D" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>RANKING BEST SELLER</Text>
          </View>
        </View>

        {/* Primer puesto */}
        <View style={styles.championContainer}>
            <View style={styles.avatarContainer}>
            <Octicons name="person" size={100} style={{top:100, color:'#F6F6F6'}}/>
            <Image source={{ uri: best_sellers[0]?.foto }} style={styles.avatarImage} /> 
            <Ionicons name='ribbon' size={60} style={{bottom:50, color:'#FFD700'}}/>
            </View>
          <Text style={styles.championTitle}>CAMPEÓN DEL MES</Text>
          <Text style={styles.name}>{best_sellers[0]?.nombre}</Text> 
          <Text style={styles.username}>{best_sellers[0]?.correo}</Text>
          <Text style={styles.username}>{best_sellers[0]?.telefono}</Text>
        </View>

        {!permiso &&
        <View style={styles.podiumContainer}>
     
          {best_sellers[1] && (
            <View style={[styles.podiumItem, styles.secondPlace]}>
              <View style={styles.podiumAvatarContainer}>
                <Image source={{ uri: best_sellers[1]?.foto }} style={styles.podiumAvatar} />
                <Ionicons name='ribbon' size={40} style={styles.silverMedal}/>
              </View>
              <Text style={styles.podiumPosition}>2°</Text>
              <Text style={styles.podiumName}>{best_sellers[1]?.nombre}</Text>
              <Text style={styles.podiumDetail}>{best_sellers[1]?.correo}</Text>
              <Text style={styles.podiumDetail}>{best_sellers[1]?.telefono}</Text>
            </View>
          )}

     
          {best_sellers[2] && (
            <View style={[styles.podiumItem, styles.thirdPlace]}>
              <View style={styles.podiumAvatarContainer}>
                <Image source={{ uri: best_sellers[2]?.foto }} style={styles.podiumAvatar} />
                <Ionicons name='ribbon' size={40} style={styles.bronzeMedal}/>
              </View>
              <Text style={styles.podiumPosition}>3°</Text>
              <Text style={styles.podiumName}>{best_sellers[2]?.nombre}</Text>
              <Text style={styles.podiumDetail}>{best_sellers[2]?.correo}</Text>
              <Text style={styles.podiumDetail}>{best_sellers[2]?.telefono}</Text>
            </View>
          )}
        </View>}

   
       {/* {!permiso && <View style={styles.otherParticipants}>
          <Text style={styles.otherParticipantsTitle}>Otros participantes destacados</Text>
          {best_sellers.slice(3).map((pub, index) => (
            <View key={index} style={styles.participantItem}>
              <Text style={styles.participantPosition}>{index + 4}°</Text>
              <Image source={{ uri: pub?.foto }} style={styles.participantAvatar} />
              <View style={styles.participantInfo}>
                <Text style={styles.participantName}>{pub.nombre}</Text>
                <Text style={styles.participantDetail}>{pub.correo}</Text>
              </View>
            </View>
          ))}
        </View>} */}

         {permiso && <TouchableOpacity onPress={clasificacion} style={styles.backButton}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Ver vendedores del mes</Text>
        </TouchableOpacity>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    
  },
  championContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  championTitle: {
    fontSize: 18,
    color: '#B8860B', 
    marginBottom: 10,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#00318D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarImage: {
    width: '90%',
    height: '90%',
    borderRadius: 100,
    bottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  podiumItem: {
    alignItems: 'center',
    width: '45%',
    padding: 15,
    borderRadius: 10,
  },
  secondPlace: {
    backgroundColor: '#F2F2F2',
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  thirdPlace: {
    backgroundColor: '#F8F8F8',
    borderColor: '#CD7F32',
    borderWidth: 2,
  },
  podiumAvatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  podiumAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  silverMedal: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    color: '#C0C0C0',
  },
  bronzeMedal: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    color: '#CD7F32',
  },
  podiumPosition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  podiumName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  podiumDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  otherParticipants: {
    marginTop: 20,
  },
  otherParticipantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  participantPosition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00318D',
    width: 30,
    textAlign: 'center',
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 15,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  participantDetail: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#00318D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
});
      
