import { Ionicons, Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';
import { useRouter, useSegments } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function Layout() {

    const segments = useSegments() as string[];
    const router = useRouter();

  // Ocultar botón si estamos en la pantalla 'publicar'
  const isOnPublicarScreen = segments.includes('publicar');
  return (
      <>
          <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#00318D',
        tabBarStyle: {
          backgroundColor: '#F68628',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: 'transparent',
          height: 70,
          paddingTop: 18,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
            <Octicons name="home" size={30} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="favoritos"
        options={{
          tabBarShowLabel: false,
          title: 'Favoritos',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="heart-outline" size={32} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="publicaciones"
        options={{
          tabBarShowLabel: false,
          title: 'Publicaciones',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="grid-outline" size={30} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="menu"
        options={{
          tabBarShowLabel: false,
          title: 'Menu',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="menu" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publicar"
        options={{
          href: null,
          tabBarStyle: { display: 'none' }, // Oculta la tab bar en esta pantalla
        }}
      />
      
    </Tabs>
    {!isOnPublicarScreen && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/formularioPublicar')}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </>

  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30, // ajusta según el tamaño de la tab bar
    backgroundColor: '#F68628',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 999,
    marginBottom: 60, // espacio adicional para evitar superposición con la tab bar
  },
});
