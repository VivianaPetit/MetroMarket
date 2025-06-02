import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '../interfaces/types'; // Asegúrate de que la ruta sea correcta

interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario) => void;
  logout: () => void;          // <-- agregar logout aquí
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  const logout = () => {
    setUser(null);

  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
