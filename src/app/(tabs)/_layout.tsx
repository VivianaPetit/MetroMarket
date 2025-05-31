import { Ionicons, Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';
import { View } from 'react-native';

export default function Layout() {
  return (
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
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
            <Octicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publicar"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ size }) => (
            <View
              style={{
                backgroundColor: 'white',
                width: size + 24,    
                height: size + 24,
                borderRadius: (size + 24) / 2,
                justifyContent: 'center',
                marginTop: 20, 
                alignItems: 'center',
                marginBottom: 5,    
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,        
              }}
            >
              <Ionicons name="add" size={size} color="#00318D" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menú',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
