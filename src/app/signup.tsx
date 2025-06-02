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
import { Usuario } from '../interfaces/types'; 
import { createUsuario } from '../services/usuarioService'; // Asegúrate de tener este servicio implementado
import { useAuth } from '../context/userContext'; // Asegúrate de que la ruta sea correcta
import * as Crypto from 'expo-crypto';

const SignUp = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { setUser } = useAuth(); // Usar el contexto de autenticación

  const validarEmail = (email: string) => {
    return /@(?:correo\.)?unimet\.edu\.ve$/i.test(email);
  };

const handleRegister = async () => {
  const newErrors: typeof errors = {};

  if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
  if (!phone.trim()) newErrors.phone = 'El teléfono es obligatorio.';
  if (!email.trim()) {
    newErrors.email = 'El correo es obligatorio.';
  } else if (!validarEmail(email)) {
    newErrors.email = 'Debes usar un correo UNIMET.';
  }
  if (!password.trim()) newErrors.password = 'La contraseña es obligatoria.';

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const cleanPassword = password.trim();
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        cleanPassword
      );

      const newUser: Usuario = {
        nombre: name,
        telefono: phone,
        correo: email,
        contrasena: hashedPassword,
      };

      await createUsuario(newUser);
      console.log('Usuario creado exitosamente');
      setUser(newUser);
      router.push('/Perfil');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      Alert.alert('Error', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
    }
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F68628" />
        </TouchableOpacity>

        <Text style={styles.welcomeText}>Crear Cuenta</Text>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.inputField}
              placeholder="Nombre completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Teléfono */}
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.inputField}
              placeholder="Número de teléfono"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        {/* Correo */}
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.inputField}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#b0b0b0"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Contraseña */}
        <View style={styles.inputGroup}>
          <View style={styles.passwordContainer}>
            <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.passwordInput}
              placeholder="Crea una contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
              <Text style={styles.showPasswordText}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Botón de registro */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>

        {/* Línea divisoria */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 40, left: 24, zIndex: 1}, 
  welcomeText: { fontSize: 56, fontWeight: 'bold', marginBottom: 30, color: '#000' },
  inputGroup: { marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputField: { flex: 1, padding: 14, fontSize: 16 },
  icon: { marginRight: 10 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  passwordInput: { flex: 1, padding: 14, fontSize: 16 },
  showPasswordButton: { padding: 14 },
  showPasswordText: { color: '#F68628', fontWeight: '500' },
  registerButton: {
    backgroundColor: '#F68628',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { width: 40, textAlign: 'center', color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#666' },
  loginText: { color: '#F68628', fontWeight: 'bold' },
  errorText: { color: '#FF4D4F', fontSize: 13, marginTop: 6, marginLeft: 6 },
});

export default SignUp;
