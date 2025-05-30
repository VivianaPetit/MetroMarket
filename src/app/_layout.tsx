import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,           
        tabBarActiveTintColor: '#F68628', 
      }}
    >
      <Tabs.Screen
        name="index"                 
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
             <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Divisas"                 
        options={{
          title: 'Divisas',
          tabBarIcon: ({ size, color }) => (
             <FontAwesome name="dollar" size={size} color={color} />
          ),
        }}
      />
      {/* Para mas pantallas se añade más <Tabs.Screen /> aquí */}
    </Tabs>
  );
}
