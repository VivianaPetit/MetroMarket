import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CategoryBadge from '../components/Category';
import ProductCard from '../components/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
//constante que guarde el link o api de lo que se va a mostrar
const baseURL = 'https://jsonplaceholder.typicode.com/posts';


const categories = [
  'Electrónica',
  'Moda',
  'Belleza',
  'Servicios',
  'Hogar',
  'Deportes',
];

const products = [
  { id: '1', name: 'Women Printed Kurta', price: 1500, image: 'https://picsum.photos/id/100/300/300' },
  { id: '2', name: 'Men Classic Shirt', price: 1200, image: 'https://picsum.photos/id/101/300/300' },
  { id: '3', name: 'Kids Denim Jeans', price: 800, image: 'https://picsum.photos/id/102/300/300' },
  { id: '4', name: 'Smartwatch XYZ', price: 3500, image: 'https://picsum.photos/id/103/300/300' },
  { id: '5', name: 'Wireless Headphones', price: 2200, image: 'https://picsum.photos/id/104/300/300' },
  { id: '6', name: 'Travel Backpack', price: 950, image: 'https://picsum.photos/id/105/300/300' },
  { id: '7', name: 'Coffee Maker', price: 1800, image: 'https://picsum.photos/id/106/300/300' },
  { id: '8', name: 'Yoga Mat', price: 600, image: 'https://picsum.photos/id/107/300/300' },
];

const prueba = [
   {userId: 1, id: 1, title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit", body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto" }
];

export default function Home() {
  //codigo que usa axio como intermediario entre el front y la base de datos solamente falta colocar la api de nuestra base de datos
  const [post, setPost] = React.useState(prueba)
  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
    
  }, []);
      console.log(post)
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="menu" size={24} color="#00318D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          <Text style={{ color: '#00318D', fontWeight: 'bold' }}>Metro</Text>
          <Text style={{ color: '#FF8C00', fontWeight: 'bold' }}>Market</Text>
        </Text>
        {/* <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity> */}
      </SafeAreaView>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#bbb" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor="#bbb"
        />
      </View>

      {/* Categorias */}

      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
           >
          {categories.map((category, index) => (
             <CategoryBadge key={category} label={category} />
          ))}
        </ScrollView>
      </View>

      {/* Products */}
      <ScrollView contentContainerStyle={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerIcon: {
    paddingLeft: 10,
    paddingBottom: 20,
    

  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 15,
    height: 45,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoriesWrapper: {
    marginTop: 12,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },

  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
