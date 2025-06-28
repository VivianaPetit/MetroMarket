import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileCardProps = {
  UserName?: string;
  nombreyA?: string;
  tlf?: string;
  foto?: string; // Cambiado de 'imagen' a 'fotoPerfil' para consistencia
  editable?: boolean;
  onNombreChange?: (text: string) => void;
  onTelefonoChange?: (text: string) => void;
  onFotoChange?: () => void; // Nueva prop para manejar el cambio de foto
  isUploading?: boolean; // Para mostrar estado de carga
};

const ProfileCard = ({
  UserName = "usuario@unimet.edu.ve",
  nombreyA = "Nombre Apellido",
  tlf = "+58 412 1234567",
  foto,
  editable = false,
  onNombreChange,
  onTelefonoChange,
  onFotoChange,
  isUploading = false,
}: ProfileCardProps) => {
  return (
    <View style={styles.container}>
      {/* Sección superior - Foto y datos básicos */}
      <View style={styles.profileHeader}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={onFotoChange}
          disabled={!editable || isUploading}
        >
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="white" />
            </View>
          )}
          
          {editable && !isUploading && (
            <View style={styles.editPhotoBadge}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          )}
          
          {isUploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{nombreyA}</Text>
          <Text style={styles.username}>{UserName}</Text>
        </View>
      </View>

      {/* Sección editable - Solo visible en modo edición */}
      {editable && (
        <TouchableOpacity 
          style={styles.editPhotoButton}
          onPress={onFotoChange}
          disabled={isUploading}
        >
          <Text style={styles.editPhotoText}>Cambiar foto de perfil</Text>
        </TouchableOpacity>
      )}

      {/* Tarjeta de información */}
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Ionicons name='person-circle-outline' size={24} color="#00318D" style={styles.detailIcon} />
          <View style={styles.detailContent}>
            {editable ? (
              <TextInput
                style={styles.editableInput}
                value={nombreyA}
                onChangeText={onNombreChange}
                placeholder="Nombre completo"
              />
            ) : (
              <>
                <Text style={styles.detailLabel}>Nombre</Text>
                <Text style={styles.detailValue}>{nombreyA}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Ionicons name='call-outline' size={24} color="#00318D" style={styles.detailIcon} />
          <View style={styles.detailContent}>
            {editable ? (
              <TextInput
                style={styles.editableInput}
                value={tlf}
                onChangeText={onTelefonoChange}
                keyboardType="phone-pad"
                placeholder="Teléfono"
              />
            ) : (
              <>
                <Text style={styles.detailLabel}>Teléfono</Text>
                <Text style={styles.detailValue}>{tlf}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00318D',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00318D',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  editPhotoButton: {
    marginBottom: 24,
  },
  editPhotoText: {
    color: '#00318D',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  editableInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
});

export default ProfileCard;