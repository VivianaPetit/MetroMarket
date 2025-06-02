import React from 'react';
import { View, Text, Image, StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const ProfileCard = ({
  UserName = "Usuario",
  nombreyA = "Nombre Apellido",
  dir = "Dirección no especificada",
  tlf = "0000000000",
  imagen = require('../../assets/images/user.png'),
  rating = 0, // 
  editable= false
}) => {
    interface EditData {
  username: string;
  fullname: string;
  address: string;
  phone: string;
  rate: number;
}
     const [editData, setEditData] = useState({
    username: UserName,
    fullname: nombreyA,
    address: dir,
    phone: tlf,
    rate: rating
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field: keyof EditData, value: string | number) => {
    setEditData(prev => ({...prev, [field]: value}));
  };

  const handleRatingChange = (newRating: number) => {
    if(isEditing) {
      setEditData(prev => ({...prev, rate: newRating}));
    }
  };

  return (
    <View style={{alignItems:'center',marginTop:5, justifyContent:'center'}} >
                <View style={styles.circleContainer}> 
                    <Image source={imagen}
                    style={styles.circleImage} />
                </View>
                
                <View style={[styles.containerAcc, {paddingTop:15}]}>
                    {isEditing ? (
                <TextInput
                style={styles.input}
                value={editData.username}
                onChangeText={(text) => handleChange('username', text)}
                />
                ) : (
                <Text style={styles.subtitle}>{editData.username}</Text>
        )}

            <View style={{flexDirection:'row',alignContent:'center',gap:2}}>
                        {[...Array(5)].map((_, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => handleRatingChange(i + 1)}
              disabled={!isEditing}
            >
              <Ionicons 
                name={i < editData.rate ? 'star' : 'star-outline'} 
                size={28} 
                color='#F68628' 
              />
            </TouchableOpacity>
          ))}
        </View>
            
            {editable && (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons 
              name={isEditing ? 'save' : 'create'} 
              size={24} 
              color="white" 
            />
            </TouchableOpacity>)}
        </View>
    
                <View style={styles.containerAcc}>
                    <View style={styles.DatosContainer}>
                        <Ionicons name='person' size={25}/>
                        {isEditing ? (
            <TextInput
              style={styles.input}
              value={editData.fullname}
              onChangeText={(text) => handleChange('fullname', text)}
            />
          ) : (
            <Text style={styles.subtitle}>{editData.fullname}</Text>
          )}
        </View>
                    
                     <View style={styles.DatosContainer}>  
                        <Ionicons name='pin' size={25}/>
                         {isEditing ? (
            <TextInput
              style={styles.input}
              value={editData.address}
              onChangeText={(text) => handleChange('address', text)}
            />
          ) : (
            <Text style={styles.subtitle}>{editData.address}</Text>
          )}
        </View>
                    <View style={styles.DatosContainer}>
                        <Ionicons name='call' size={25}/>
                        {isEditing ? (
            <TextInput
              style={styles.input}
              value={editData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.subtitle}>{editData.phone}</Text>
          )}
        </View>
                </View>
    </View>
  )}

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
    
  }, input: {
    flex: 1,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginLeft: 10,
    paddingVertical: 5,
  }, editButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  }

  }

)

export default ProfileCard;