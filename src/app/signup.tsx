import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Usuario } from '../interfaces/types';
import { createUsuario } from '../services/usuarioService';
import { useAuth } from '../context/userContext';
import * as Crypto from 'expo-crypto';
import { buscarUsuarioPorCorreo } from '../services/usuarioService';
import * as Notifications from 'expo-notifications';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  // Validar correo institucional
  const validarEmail = (email: string) => {
    return /@(?:correo\.)?unimet\.edu\.ve$/i.test(email);
  };


  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const registerForPushNotifications = async () => {
    let token;
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Permisos de notificación no otorgados!');
      return null;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const handleRegister = async () => {
    const newErrors: typeof errors = {};

    // Validar nombre
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = 'El nombre es obligatorio.';
    } else if (trimmedName.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
    } else if (trimmedName.length > 50) {
      newErrors.name = 'El nombre no puede superar los 50 caracteres.';
    }

    // Validar teléfono
    const trimmedPhone = formData.phone.trim();

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!validarEmail(formData.email)) {
      newErrors.email = 'Debes usar un correo UNIMET.';
    }

    // Validar contraseña
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // Verificar si el correo ya existe
      try {
        await buscarUsuarioPorCorreo(formData.email.trim());
        Alert.alert('Error', 'Este correo ya está registrado');
        return;
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('Error al verificar correo:', error);
          throw error;
        }
      }

      const expoPushToken = await registerForPushNotifications();

      // Hashear la contraseña
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        formData.password.trim()
      );
      console.log(hashedPassword);

      const newUser: Omit<Usuario, '_id'> = {
        nombre: trimmedName,
        telefono: trimmedPhone,
        correo: formData.email.trim(),
        contrasena: hashedPassword,
        foto: '',
        publicaciones: [],
        favoritos: [],
        transacciones: [],
        expoPushToken: expoPushToken || ''
      };

      const createdUser = await createUsuario(newUser);

      setUser(createdUser);

            
      if (!expoPushToken) {
        Alert.alert(
          'Aviso', 
          'No se pudieron configurar las notificaciones. Por favor habilita los permisos en configuración.'
        );
      }

      router.push('/perfil');
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', 'Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F68628" />
        </TouchableOpacity>

        <Text style={styles.welcomeText}>Crear Cuenta</Text>

        {/* Campos del formulario */}
        {['name', 'phone', 'email', 'password'].map((field) => (
          <View key={field} style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons
                name={
                  field === 'name' ? 'person' :
                  field === 'phone' ? 'call' :
                  field === 'email' ? 'mail' : 'lock-closed'
                }
                size={20}
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.inputField}
                placeholder={
                  field === 'name' ? 'Nombre completo' :
                  field === 'phone' ? 'Número de teléfono' :
                  field === 'email' ? 'Correo electrónico' : 'Crea una contraseña'
                }
                value={formData[field as keyof typeof formData]}
                onChangeText={(text) => handleChange(field as keyof typeof formData, text)}
                secureTextEntry={field === 'password' && !showPassword}
                keyboardType={
                  field === 'email' ? 'email-address' :
                  field === 'phone' ? 'phone-pad' : 'default'
                }
                autoCapitalize={field === 'name' ? 'words' : 'none'}
              />
              {field === 'password' && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordButton}
                >
                  <Text style={styles.showPasswordText}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.registerButton, isSubmitting && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          <Text style={styles.registerButtonText}>
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

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
  disabledButton: { opacity: 0.7 },
});

export default SignUp;