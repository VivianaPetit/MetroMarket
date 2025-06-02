import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Background } from '@react-navigation/elements';
import ProfileCard from '../components/ProfileCard';

export default function Perfil() {
  return (
    <View style={{flex:1,backgroundColor:'#fff'} }>

        <View style={styles.containerAcc}>  

            <View style={{flexDirection:'row',gap:150,alignItems:'center',justifyContent:'center'}}>
                <Text style={styles.title}>My Account</Text>\
                <TouchableOpacity>
                <Ionicons name='create' color='white' size={35}/>
                </TouchableOpacity>
            </View>

            <ProfileCard
            UserName="SamiRojas10"
            nombreyA="Samantha Rojas"
            dir="Av. Fuerzas Armadas"
            tlf="0412505981"
            imagen={require('../../assets/images/perfil.jpeg')}
            rating={5}
            editable={false} />
            

        </View>
            <TouchableOpacity>
            <View style={[styles.containerAcc, {backgroundColor: '#F6F6F6',flexDirection:'row',paddingTop:10}]}>
                <Ionicons name='log-out' color='gray' size={40}/>
                <View style={{flexDirection:'column',margin:5}}>
                <Text style={[styles.subtitle, {color:'gray',fontSize:20}]}>Cerrar Sesion</Text>
                <Text style={[styles.subtitle, {color:'black',fontSize:15}]}>Asegure su cuenta para mayor seguridad</Text>
                </View>
            </View>
            </TouchableOpacity>
        </View>

    
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    containerAcc : {
        backgroundColor:'#00318D',
        padding:10,
        paddingTop:25,
        alignItems:'center',
        justifyContent:'center',
        
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 10
    },
    subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'white',
    
    },
    circleContainer: {
    margin:10,
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden', // Recorta la imagen para que sea circular
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  DatosContainer:{
    alignSelf:'flex-start',
    borderRadius: 15,
    padding:12,
    backgroundColor:'#00256B',
    flexDirection: 'row',
    gap:7,
    alignItems:'center',
    marginBottom: 5
    
  }

  }

)