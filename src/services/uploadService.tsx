// services/uploadService.ts
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../supabase';

export async function seleccionarImagen() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
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
    .from('imagenes-publicaciones') // nombre del bucket en Supabase
    .upload(nombreArchivo, blob, {
      contentType: 'image/jpeg',
    });

  if (error) throw error;

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from('imagenes-publicaciones')
    .getPublicUrl(nombreArchivo);

  return publicUrlData.publicUrl;
}
