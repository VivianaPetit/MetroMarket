import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import CommentCard from '../components/CommentCard';
import { useAuth } from '../context/userContext';
import { editarUsuario, obtenerUsuarioPorCorreo } from '../services/UsuarioService';

export default function Perfil() {
  const router = useRouter();
  const { user, logout, setUser } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [colorMensaje, setColorMensaje] = useState('green');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre ?? '');
  const [telefono, setTelefono] = useState(user?.telefono ?? '');
  const [showReviews, setShowReviews] = useState(false);
  const [usuarioPerfil, setUsuarioPerfil] = useState<any>(null);
  const params = useLocalSearchParams();
  const usernameParam = params.username as string;

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        if (usernameParam) {
          const usuario = await obtenerUsuarioPorCorreo(usernameParam);
          setUsuarioPerfil(usuario);
        } else if (user) {
          setUsuarioPerfil(user);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    cargarPerfil();
  }, [usernameParam, user]);

  const esMiPerfil = !usernameParam || (user && user.correo === usernameParam);

  if (!usuarioPerfil) {
    return <Text style={{ padding: 20 }}>Cargando...</Text>;
  }

  const comentarios = [
    { UserName: "Juan", commentText: "Excelente servicio!" },
    { UserName: "María", commentText: "Muy atenta y rápida respuesta" },
  ];

  const handleLogout = () => {
    logout?.();
    router.push('./');
  };

  const handleGuardar = async () => {
    if (!user) return;

    try {
      const usuarioActualizado = await editarUsuario(user._id, { nombre, telefono });
      setUser(usuarioActualizado);
      setModoEdicion(false);
      setMensaje('Perfil actualizado exitosamente');
      setColorMensaje('green');
    } catch (error) {
      setMensaje('Error al actualizar el perfil');
      setColorMensaje('red');
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00318D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{esMiPerfil ? "Mi perfil" : "Perfil de Usuario"}</Text>

        {esMiPerfil && (
          <TouchableOpacity onPress={() => setModoEdicion(!modoEdicion)}>
            <Ionicons name={modoEdicion ? "close" : "create"} color="#00318D" size={24} />
          </TouchableOpacity>
        )}
      </View>

      <ProfileCard
        UserName={usuarioPerfil?.username ?? 'Usuario'}
        nombreyA={modoEdicion ? nombre : usuarioPerfil.nombre}
        tlf={modoEdicion ? telefono : usuarioPerfil.telefono}
        editable={!!modoEdicion && !!esMiPerfil}
        onNombreChange={setNombre}
        onTelefonoChange={setTelefono}
      />

      {esMiPerfil ? (
        <>
          {mensaje !== '' && (
            <View style={{ padding: 10, borderRadius: 8, marginTop: 8, marginHorizontal: 20 }}>
              <Text style={{ color: colorMensaje, textAlign: 'center' }}>{mensaje}</Text>
            </View>
          )}

          {modoEdicion && (
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleGuardar}>
              <Ionicons name="save" color="white" size={20} />
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          )}

          {!modoEdicion && (
            <>
              <TouchableOpacity style={styles.button} onPress={() => setShowReviews(prev => !prev)}>
                <Ionicons name="chatbubbles-outline" color="#F68628" size={20} />
                <Text style={styles.buttonTextAlt}>
                  {showReviews ? 'Ocultar reseñas' : 'Ver mis reseñas'}
                </Text>
              </TouchableOpacity>

              {showReviews && (
                <View style={styles.commentsContainer}>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
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

              <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Ionicons name="log-out" color="#F68628" size={20} />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={() => setShowReviews(prev => !prev)}>
            <Ionicons name="chatbubbles-outline" color="#F68628" size={20} />
            <Text style={styles.buttonTextAlt}>
              {showReviews ? 'Ocultar reseñas' : 'Ver reseñas'}
            </Text>
          </TouchableOpacity>

          {showReviews && (
            <View style={styles.commentsContainer}>
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00318D',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 1 },
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonTextAlt: {
    color: '#F68628',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  logoutText: {
    color: '#F68628',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  commentsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    elevation: 1,
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 1 },
    marginBottom: 20,
  },
});
