import { Platform, StyleSheet, Text, View } from 'react-native';

export const Categories =()=>{ 
    return(
    <View style={styles.Container}>
        <div><Text>Electronica</Text></div>
        <div><Text>Moda</Text></div>
        <div><Text>Belleza</Text></div>   #luego poner dependiendo de cuantas categorias hay, que se genere la cantidad de divs especificos
        <div><Text>Servicios</Text></div>
        <div><Text>Electronica</Text></div>
        <div><Text>Moda</Text></div>
    </View>


);
}

const styles = StyleSheet.create({
    Container:{
        flex: 1,
        justifyContent: 'center',
        flexWrap: 'wrap',  
        flexDirection: 'row',
        gap: 13
    },
    divCategorie: {
     flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'white',
  
  ...Platform.select({
    ios: {
      shadowColor: '#F7E0AB',
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    },
  }),
},

})

