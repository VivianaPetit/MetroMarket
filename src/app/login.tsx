import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { buscarUsuarioPorCorreo } from '../services/usuarioService';
import { useAuth } from '../context/userContext';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  

  const router = useRouter();
  const { setUser } = useAuth();

  const validarEmail = (correo: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@(correo\.)?unimet\.edu\.ve$/.test(correo);
  };

  const handleLogin = async () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!validarEmail(email)) {
      newErrors.email = 'Debes usar un correo UNIMET.';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const user = await buscarUsuarioPorCorreo(email);
        console.log(email);

        if (!user) {
          Alert.alert('Error', 'Usuario no encontrado.');
          return;
        }

        const hashedPassword = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          password.trim()
        );

        console.log(user.nombre, user.correo, user.telefono, user.contrasena);
        console.log(typeof user.contrasena); 
        
        if (user.contrasena !== hashedPassword) {
          Alert.alert('Error', 'Contraseña incorrecta.');
          return;
        }

        setUser(user);
        router.push('/perfil');

      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F68628" />
        </TouchableOpacity>

        <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showPasswordText}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
        </View>


        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  welcomeText: { fontSize: 60, fontWeight: 'bold', marginBottom: 40, color: '#000' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  backButton: { position: 'absolute', top: 40, left: 24, zIndex: 1 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  passwordInput: { flex: 1, padding: 14, fontSize: 16 },
  showPasswordButton: { padding: 14 },
  showPasswordText: { color: '#F68628', fontWeight: '500' },
  loginButton: { backgroundColor: '#F68628', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { width: 40, textAlign: 'center', color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#666' },
  signupText: { color: '#F68628', fontWeight: 'bold' },
});

export default LoginScreen;