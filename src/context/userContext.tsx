import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '../interfaces/types';
import { fetchUsuarioById } from '../services/usuarioService'; // IMPORTANTE: crea o asegura que exista esta función




interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario) => void;
  logout: () => void;
  refrescarUsuario: () => Promise<void>;  // <-- agrega esta función
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  const logout = () => {
    setUser(null);
  };

  const refrescarUsuario = async () => {
  // console.log('refrescarUsuario, user:', user);
  if (user?._id) {
    //console.log('refrescarUsuario, user._id:', user,  user._id);
    try {
      const usuarioActualizado = await fetchUsuarioById(user._id);
      setUser(usuarioActualizado);
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
    }
  } else {
    console.warn('No hay user._id para refrescar');
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
