// services/uploadService.ts
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../supabase';

export async function seleccionarImagen() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images', // Usando el tipo directamente como string
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri;
  } else {
    throw new Error('Selección cancelada');
  }
}

export async function subirImagen(uri: string, userId: string) {
  const nombreArchivo = `${userId}-${Date.now()}.jpg`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from('publicaciones') // nombre del bucket en Supabase
    .upload(nombreArchivo, blob, {
      contentType: 'image/jpeg',
    });

  if (error) throw error;

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from('publicaciones')
    .getPublicUrl(nombreArchivo);

  return publicUrlData.publicUrl;
}
