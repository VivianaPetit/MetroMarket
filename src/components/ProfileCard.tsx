import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const ProfileCard = ({
  UserName = "Usuario",
  nombreyA = "Nombre Apellido",
  tlf = "0000000000",
  imagen = require('../../assets/images/user.png'),
  editable = false
}) => {
  interface EditData {
    username: string;
    fullname: string;
    phone: string;
  }

  const [editData, setEditData] = useState({
    username: UserName,
    fullname: nombreyA,
    phone: tlf
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field: keyof EditData, value: string) => {
    setEditData(prev => ({...prev, [field]: value}));
  };

  return (
    <View style={{alignItems: 'center', marginTop: 5, justifyContent: 'center'}}>
      <View style={styles.circleContainer}> 
        <Image source={imagen} style={styles.circleImage} />
      </View>
      
      <View style={[styles.containerAcc, {paddingTop: 15}]}>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editData.username}
            onChangeText={(text) => handleChange('username', text)}
          />
        ) : (
          <Text style={styles.subtitle}>{editData.username}</Text>
        )}

        {editable && (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons 
              name={isEditing ? 'save' : 'create'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerAcc: {
    backgroundColor: '#00318D',
    padding: 10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
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
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  DatosContainer: {
    alignSelf: 'flex-start',
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#00256B',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    marginBottom: 5,
    width: '100%'
  }, 
  input: {
    flex: 1,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginLeft: 10,
    paddingVertical: 5,
  }, 
  editButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  }
});

export default ProfileCard;