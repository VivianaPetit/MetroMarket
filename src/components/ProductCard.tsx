import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native';

const { width } = Dimensions.get('window');

type ProductCardProps = {
  name: string;
  price: number;
  category: string;
  image: string; 
};

const ProductCard: React.FC<ProductCardProps> = ({ name, price, category, image }) => {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: image }} style={styles.productImage} />
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productPrice}>${price}</Text>
      <Text style={styles.productCategory}>{category}</Text>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: (width / 2) - 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 2,
    shadowColor: '#FF8C00',
    alignItems: 'center',
  },

  productImage: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },

  productCategory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    margin: 10,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});