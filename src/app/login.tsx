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
import { useRouter } from 'expo-router';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#00318D" />
      </TouchableOpacity>
      <Text style={styles.title}>
        <Text style={styles.titleBold}>¡Bienvenido de vuelta!</Text> 
      </Text>

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

      {/* Botón Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={{ color: '#555' }}>Crea una cuenta </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'left',
  },
  titleBold: {
    fontWeight: 'bold',
  },
  titleUnderline: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#0077cc',
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  dividerText: {
    color: '#555',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#f58220',
    fontWeight: 'bold',
  },
    backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});
