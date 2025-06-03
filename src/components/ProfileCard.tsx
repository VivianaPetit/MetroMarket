import React from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileCard = ({
  UserName = "Usuario",
  nombreyA = "Nombre Apellido",
  tlf = "0000000000",
  imagen = require('../../assets/images/user.png'),
  editable = false,
  onNombreChange = () => {},
  onTelefonoChange = () => {},
}: {
  UserName?: string;
  nombreyA?: string;
  tlf?: string;
  imagen?: any;
  editable?: boolean;
  onNombreChange?: (text: string) => void;
  onTelefonoChange?: (text: string) => void;
}) => {
  return (
    <View style={{ alignItems: 'center', marginTop: 5, justifyContent: 'center' }}>
      <View style={styles.circleContainer}>
        <Image source={imagen} style={styles.circleImage} />
      </View>

      <View style={[styles.containerAcc, { paddingTop: 15 }]}>
        <Text style={[styles.subtitle, { textAlign: 'center' }]}>{UserName}</Text>
      </View>

      <View style={styles.containerAcc}>
        <View style={[styles.DatosContainer, { justifyContent: 'center' }]}>
          <Ionicons name='person' size={25} />
          {editable ? (
            <TextInput
              style={[styles.input, { textAlign: 'center' }]}
              value={nombreyA}
              onChangeText={onNombreChange}
            />
          ) : (
            <Text style={[styles.subtitle, { textAlign: 'center', flex: 1 }]}>{nombreyA}</Text>
          )}
        </View>

        <View style={[styles.DatosContainer, { justifyContent: 'center' }]}>
          <Ionicons name='call' size={25} />
          {editable ? (
            <TextInput
              style={[styles.input, { textAlign: 'center' }]}
              value={tlf}
              onChangeText={onTelefonoChange}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={[styles.subtitle, { textAlign: 'center', flex: 1 }]}>{tlf}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  containerAcc: {
    backgroundColor: '#00318D',
    padding: 10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#00256B',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },
  input: {
    flex: 1,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingVertical: 5,
  },
});