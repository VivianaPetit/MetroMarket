import React, { useEffect, useState } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  ScrollView
} from 'react-native';
import ProductCard from '../components/ProductCard';
import axios from "axios";
import { Publicacion } from '../interfaces/types';
const publicacionesURL = "http://192.168.68.109:3000/api/publicaciones";


const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
type CategoryBadgeProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

<<<<<<< Updated upstream
const CategoryBadge: React.FC<CategoryBadgeProps> = ({ label, onPress, style, textStyle }) => {
const buscado = async (): Promise<Publicacion[]> => {
  try {
    const response = await axios.get<Publicacion[]>(publicacionesURL, {
  params: {
    categoria: label,
  }
});
    return response.data;
  } catch (error) {
    console.error('Error fetching publicaciones:', error);
    throw error;
  }
};
  useEffect(() => {
        buscado()
        .then(data => setPublicaciones(data.slice(0, 10)))
        .catch(console.error);
    }, []);

=======
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  label, 
  onPress, 
  isSelected = false, // Valor por defecto
  style, 
  textStyle,
}) => {
>>>>>>> Stashed changes
  return (
    <TouchableOpacity style={[styles.categoryButton, style]} onPress={onPress}>
      <Text style={[styles.categoryButtonText, textStyle]}>{label}</Text>
      <ScrollView contentContainerStyle={styles.productsGrid}>
        {publicaciones.map((pub) => (
          <ProductCard
            key={pub._id}
            name={pub.titulo}
            price={pub.precio}
            image={
                pub.fotos && pub.fotos.length > 0
                ? pub.fotos[0]
                : 'https://wallpapers.com/images/featured/naranja-y-azul-j3fug7is7nwa7487.jpg'
            }
          />
        ))}
      </ScrollView>
    </TouchableOpacity>
    
  );
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

    productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
