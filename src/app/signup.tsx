import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import  { useRouter }  from 'expo-router';

// Define tu tipo de rutas según tu stack de navegación
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = () => {
    // Validaciones y lógica para crear cuenta
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#00318D" />
      </TouchableOpacity>
      <Text style={styles.title}> Registrarse </Text>
            {/* Nombre */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

            {/* Telefono */}
      <View style={styles.inputContainer}>
        <Ionicons name="call" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Telefono"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Contraseña */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Botón Crear Cuenta */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </TouchableOpacity>

      {/* Ya tengo cuenta */}
      <View style={styles.footer}>
        <Text style={{ color: '#555' }}>Ya tengo una cuenta </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#f58220',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#f58220',
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});
