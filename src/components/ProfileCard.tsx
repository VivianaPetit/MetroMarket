import React from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileCardProps = {
  UserName?: string;
  nombreyA?: string;
  tlf?: string;
  imagen?: any;
  editable?: boolean;
  onNombreChange?: (text: string) => void;
  onTelefonoChange?: (text: string) => void;
};

const ProfileCard = ({
  UserName = "Usuario",
  nombreyA = "Nombre Apellido",
  tlf = "0000000000",
  imagen,
  editable = false,
  onNombreChange,
  onTelefonoChange,
}: ProfileCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imagen} style={styles.image} />
      </View>

      <Text style={styles.email}>{UserName}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name='person-outline' size={24} color="#F68628" style={styles.icon} />
          {editable ? (
            <TextInput
              style={styles.input}
              value={nombreyA}
              onChangeText={onNombreChange}
              placeholder="Nombre completo"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoText}>{nombreyA}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Ionicons name='call-outline' size={24} color="#F68628" style={styles.icon} />
          {editable ? (
            <TextInput
              style={styles.input}
              value={tlf}
              onChangeText={onTelefonoChange}
              keyboardType="phone-pad"
              placeholder="Teléfono"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoText}>{tlf}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F68628',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 4, // Android sombra
    shadowColor: '#000', // iOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    paddingVertical: 2,
  },
});
