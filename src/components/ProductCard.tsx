import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width } = Dimensions.get('window');

type ProductCardProps = {
  name: string;
  price: number;
  priceTasa: number;
  formCoin: string;
  category: string;
  image: string;
  tipo: string;
  onEdit?: () => void;
  onPress?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  price, 
  priceTasa,
  formCoin,
  category, 
  image, 
  tipo, 
  onEdit,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {tipo !== 'Samanes' ? (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image }} 
            style={styles.productImage}
            resizeMode="cover"
          />  
          {onEdit && (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
      <View>
        {onEdit && (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop:16, marginBottom:4}}>
          <Text style={{ fontSize: 18, fontWeight: 'bold'}}>🌳</Text>
          <Text style={styles.chip}>{price}</Text>     
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom:16}}>
          <Text style={styles.chip2}>{formCoin}</Text> 
        </View>
        <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}> 
          <AntDesign name="retweet" size={28} color="#FF8C00"/>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop:16, marginBottom:6}}>
          <Text style={styles.chip}>{priceTasa}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Bs</Text>          
        </View>
      </View>
      )}
      
      {/* Información común */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2}>{name}</Text>
        
        {tipo !== 'Samanes' && (
          <Text style={styles.priceText}>${price.toFixed(2)}</Text>
        )}
        
        <View style={styles.metaContainer}>
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag" size={12} color="#00318D" />
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          
          {tipo === 'Producto' ? (
            <View style={styles.typeBadgeProduct}>
              <Text style={styles.typeProductText}>{tipo}</Text> 
            </View>
          ) : tipo === 'Servicio' ? ( 
            <View style={styles.typeBadgeService}>
              <Text style={styles.typeServiceText}>{tipo}</Text> 
            </View>
          ) : (
            <View style={styles.typeBadgeSamanes}>
              <Text style={styles.typeSamanesText}>{tipo}</Text> 
            </View>
          )}     
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CARD_WIDTH = (width / 2) - 16;
const IMAGE_HEIGHT = CARD_WIDTH * 0.8;

const styles = StyleSheet.create({
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  samanesContainer: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  currencySection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bsSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  bsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  currencyAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 4,
  },
  bsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginRight: 4,
  },
  currencyType: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  bsType: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '600',
  },
  currencyLabel: {
    fontSize: 12,
    color: '#666',
  },
  bsLabel: {
    fontSize: 12,
    color: '#666',
  },
  tasaText: {
    fontSize: 12,
    color: '#FF8C00',
    marginTop: 4,
    fontWeight: '600',
  },
  conversionIcon: {
    padding: 8,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  infoContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    height: 40,
    lineHeight: 20,
  },
  priceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#00318D',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadgeProduct: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadgeService: {
    backgroundColor: '#FEF2E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadgeSamanes: {
    backgroundColor: '#f0fff5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeProductText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00318D',
    textTransform: 'capitalize',
  },
  typeServiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F68628',
    textTransform: 'capitalize',
  },
  typeSamanesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#29f56d',
    textTransform: 'capitalize',
  },  
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EEE',
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 4,
    borderRadius: 100,
    maxWidth: '80%',
    minWidth: '50%',
    padding: 12,
    fontSize: 14,
    textAlign: 'center',
  },  
  chip2: {
    backgroundColor: '#d5edfc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: '600',
    color: '#29a5f5',
    textTransform: 'capitalize',
  },
});

export default ProductCard;