import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // <-- NEW: Import Ionicons

const { width } = Dimensions.get('window');

// <-- MODIFIED: Add onEdit to ProductCardProps
type ProductCardProps = {
  name: string;
  price: number;
  category: string;
  image: string;
  onEdit?: () => void; // Optional function for edit action
};

const ProductCard: React.FC<ProductCardProps> = ({ name, price, category, image, onEdit }) => {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: image }} style={styles.productImage} />

      {/* <-- NEW: Edit Icon */}
      {onEdit && ( // Only render if onEdit prop is provided
        <TouchableOpacity style={styles.editIconContainer} onPress={onEdit}>
          <Ionicons name="pencil-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}

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
    overflow: 'hidden', // KEEP THIS: Important for the borderRadius to clip children
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 2,
    shadowColor: '#FF8C00',
    alignItems: 'center',
    // position: 'relative' is implicitly handled by RN if children are absolute
  },

  productImage: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  // <-- NEW: Style for the edit icon container
  editIconContainer: {
    position: 'absolute',
    top: 8, // Distance from the top of the productCard
    right: 8, // Distance from the right of the productCard
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    borderRadius: 15, // Makes it a circle (half of width/height for a 30x30 circle)
    width: 30, // Fixed width
    height: 30, // Fixed height
    justifyContent: 'center', // Center icon horizontally
    alignItems: 'center', // Center icon vertically
    zIndex: 1, // Ensure it's above the image
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