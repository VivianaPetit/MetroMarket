import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import axios from "axios";
import { Publicacion } from '../interfaces/types';
import { Label } from '@react-navigation/elements';
const publicacionesURL = "http://192.168.68.109:3000/api/publicaciones";

type CategoryBadgeProps = {
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => undefined;
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ label, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.categoryButton, style]} onPress={Buscar}>
      <Text style={[styles.categoryButtonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

 const Buscar = async (): Promise<Publicacion[]> => {
  try {
    const response = await axios.get<Publicacion[]>(publicacionesURL,{
  params: {
    categoria: "Calzado"
  }
});
    return response.data;
  } catch (error) {
    console.error('Error fetching publicaciones:', error);
    throw error;
  }
};

export default CategoryBadge;

const styles = StyleSheet.create({
  categoryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    margin: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',

    // Sombra naranja
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 6,
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});
