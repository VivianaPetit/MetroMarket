import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View,ScrollView } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/userContext'; 
import { editarUsuario } from '../services/usuarioService';
import React, { useState } from 'react';
import CommentCard from '../components/CommentCard';




export default function Perfil() {

  const router = useRouter();
  const { user, logout, setUser } = useAuth();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre ?? '');
  const [telefono, setTelefono] = useState(user?.telefono ?? '');

  const [showReviews, setShowReviews] = useState(false);
  // Ejemplo de datos para las resenas, sacar esto del backend
 const comentarios = [
    { UserName: "Juan", commentText: "Excelente servicio!rxdcfvgbhnjmnhibgvfyrdcsxasedrtfvgyubhnjmkjhugfvcdtxszasxdcfyvgubhhjnn" },
    { UserName: "María", commentText: "zasrtdfyvgubihnjgvfycdxrsezxdtcf" },
    { UserName: "Juan", commentText: "Excelente servicio!" },
    { UserName: "María", commentText: "Muy buena atención" },
    { UserName: "Juan", commentText: "Excelente servicio!" },
    
    
    
  ];

  const handleLogout = () => {
    logout?.(); 
    router.push('./');
  };

  const handleGuardar = async () => {
    if(!user){
      return
    }
    try {
      const usuarioActualizado = await editarUsuario(user._id, { nombre, telefono });
      setUser(usuarioActualizado); // Actualizar en el contexto
      setModoEdicion(false);
    } catch (error) {
      alert('Hubo un error actualizando el perfil');
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.containerAcc}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("./")}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={{ width: 30 }} />
          <Text style={styles.title}>Mi Perfil</Text>
          <TouchableOpacity onPress={() => setModoEdicion(!modoEdicion)}>
            <Ionicons name={modoEdicion ? "close" : "create"} color="white" size={30} />
          </TouchableOpacity>
        </View>

        <ProfileCard
          UserName={user?.correo ?? 'Usuario'}
          nombreyA={modoEdicion ? nombre : user?.nombre ?? 'Nombre'}
          tlf={modoEdicion ? telefono : user?.telefono ?? ''}
          editable={modoEdicion}
          onNombreChange={setNombre}
          onTelefonoChange={setTelefono}
        />
      </View>

      {modoEdicion && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleGuardar}>
          <Ionicons name="save" color="green" size={24} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: 'green', fontSize: 16 }}>Guardar Cambios</Text>
          </View>
        </TouchableOpacity>
      )}
      
    {!modoEdicion && (
        <TouchableOpacity style={styles.resena} onPress={() => setShowReviews(prevState =>  !prevState)}>
          <Ionicons name="chatbubbles" color="black" size={24} />
          <View >
            <Text style={{ color: 'black', fontSize: 16,marginRight:15 }}>Reseñas</Text>
          </View>
        </TouchableOpacity>
        
      )}

      {showReviews && (
            <View style={styles.commentsContainer}>
              <ScrollView 
                style={{ maxHeight: 300 }} 
                nestedScrollEnabled={true} 
              >
                {comentarios.map((comentario, index) => (
                  
                  <CommentCard
                    key={index}
                    UserName={comentario.UserName}
                    commentText={comentario.commentText}
                  />
                  
                ))}
              </ScrollView>
            </View>
          )}
        

      
      {!modoEdicion && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" color="gray" size={24} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: 'gray', fontSize: 16 }}>Cerrar Sesión</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  CommentBox:{
    flexDirection:'row',
    alignSelf:'center',
    alignContent:'flex-start',
    padding:5,
    marginLeft:30,
  },
  comment:{marginTop:7,marginRight:5,width:'90%',backgroundColor:'#F6F6F6',padding:3,borderRadius:5},
  
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  commentsContainer: {
    flex: 1,
    paddingHorizontal: 15,
    
   
  },
   closeButton: {
    padding: 5,
  },
  resena: {
    
    padding: 12,
    backgroundColor: '#F68628',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent:'center',
    marginBottom: 5,
    
  },
  container: {
    padding: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerAcc: {
    backgroundColor: '#00318D',
    padding: 10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 62
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'white'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 12,
    margin: 20,
    borderRadius: 10
  },
  circleContainer: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden'
  },
  circleImage: {
    width: '100%',
    height: '100%'
  },
  DatosContainer: {
    alignSelf: 'flex-start',
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#00256B',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    marginBottom: 5
  },
    backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5
  },
});
