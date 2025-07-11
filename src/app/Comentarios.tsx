import { TouchableOpacity,StyleSheet, View,Text,TextInput, Button,Alert } from "react-native";
import { useRouter,useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/userContext';
import { Resena } from '../interfaces/types';
import { createResena } from '../services/ResenaServices';

export default function Review_PostShoping() {
  const router = useRouter();
  const [value, onChangeText] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [Finalizado, setFinalizado] = useState(false);
  const [Rating, setRating] = useState(0)
  const { user } = useAuth();
  const params = useLocalSearchParams();

   const fecha = new Date()
const { 
     vendedor
  } = params as { 
    vendedor?: string; 
  };

  if (!user) {
    Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero.');
    router.push("./");
    return;
  }


     const newResena: Omit<Resena, '_id'> = {
         usuario: user ? user._id : '',
         resenado: vendedor || 'Vendedor desconocido',
         comentario: value,
         fecha: fecha,
         calificacion: Rating, 
      };

  const handleRatingChange = (newRating: number) => {
    if(isEditing) {
      setRating(newRating);
      setFinalizado(true)
    }
  };

 const  continurar =  async () => {
     //console.log(Rating)
    if (Finalizado){
        const createdUser = await createResena(newResena);
        console.log('Usuario creado exitosamente');
        router.push('./')
    }else{
       Alert.alert('Error de datos', 'Por favor califique a su vendedor.')
    }
  };

return (
<View style={styles.container}>
    <Text>Comentarios</Text>
    <Text>Por favor clasifique el vendedor de este producto</Text>
<View style={{flexDirection:'row',alignContent:'center',gap:2}}>
                        {[...Array(5)].map((_, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => handleRatingChange(i + 1)}
              disabled={!isEditing}
            >
              <Ionicons 
                name={i < Rating ? 'star' : 'star-outline'} 
                size={28} 
                color='#F68628' 
              />
            </TouchableOpacity>
          ))}
        </View>

    <Text>Deje un comentario</Text>
    <View>
        <TextInput
          editable
          multiline
          numberOfLines={10}
          maxLength={400}
          onChangeText={text => onChangeText(text)}
          value={value}
          style={styles.textInput}
        />
        </View>
     <Button 
            title ='Finalizar compra'
            onPress={continurar}
         />
      <Button 
            title ='Ir al inicio'
            onPress={() => router.push('/')}
         />
</View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingBottom: 80,
  },
  buyButton: {
   backgroundColor: '#00318D',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  }, 
  textInput: {
    padding: 10,
    height: 100,
    margin: 12,
    borderWidth: 1,
     backgroundColor: '#f8f8ff'
  },
});
