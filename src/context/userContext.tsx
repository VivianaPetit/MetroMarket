import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Usuario } from '../interfaces/types';
import { fetchUsuarioById } from '../services/usuarioService';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario) => void;
  logout: () => void;
  refrescarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para registrar el dispositivo para notificaciones
async function registerForPushNotifications() {
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
    console.warn('Permisos de notificación no otorgados');
    return null;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  const logout = () => {
    setUser(null);
  };

  const refrescarUsuario = async () => {
    if (user?._id) {
      try {
        const usuarioActualizado = await fetchUsuarioById(user._id);
        setUser(usuarioActualizado);
      } catch (error) {
        console.error('Error al refrescar usuario:', error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refrescarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};