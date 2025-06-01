import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Category from '../../components/Category'

const notphoto = require('../../../assets/images/image_not.png')

export default function Publicar() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}> Inserta fotos de tu producto</Text> 
      <View style={styles.photoContainer}>
        <Image source={notphoto}></Image>
      </View>
      <View style={[styles.photoContainer, { width:135, height:135}]}><Image source={notphoto}></Image></View>
      <View style={[styles.photoContainer, { width:135, height:135}]}><Ionicons name='add' size={80} color='#AEB7BE'></Ionicons></View>
      <View style={styles.imputBox}><Text style={{color:'#A2A59D'}}>Nombre del Producto...</Text></View> #scroll o que quepa todo el texto paro todos los inputs
      
      <View style={{flexDirection:'row',margin:5}}>
        <Text style={styles.title}>$</Text>
        <View style={[styles.imputBox,{ width: 70, height:43,marginHorizontal:15}]}></View>
        <Ionicons name='shuffle' size={45}> </Ionicons>
        <View style={[styles.imputBox,{ width: 70, height:43,marginHorizontal:4}]}></View>
        <Text style={styles.title}>BS</Text>
      </View>
      
      <View style={{flexDirection:'column',margin:5}}>
      <Text style={styles.title}>Seleccione categoria </Text> 
      <Category label='Belleza'></Category>
      </View>


      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    backgroundColor: '#EAEDEE',
    justifyContent: 'center',
    alignItems: 'center',
    width: 290,
    height: 250,
    borderRadius:20,
  },
  container: {
    paddingTop:15,
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexWrap: 'wrap',  
    flexDirection: 'row' ,
    gap: 13,        
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#F68628',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imputBox:{
    backgroundColor: '#F6F6F6',
    borderRadius:20,
    width: 290,
    padding:15,
    borderWidth: 1, 
    borderColor: '#000000',
    
    

  }
});
