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
        name="publicar"
        options={{
          tabBarLabel: () => null,
          tabBarStyle: {display:'none'},
          tabBarIcon: ({ size }) => (
            <View
              style={{
                backgroundColor: 'white',
                width: size + 30,    
                height: size + 30,
                borderRadius: (size + 30) / 2,
                justifyContent: 'center',
                marginTop: 0, 
                alignItems: 'center',
                marginBottom: 7,    
                elevation: 5, 
                borderWidth: 3,
                borderColor: '#F68628',   
                shadowColor: '#F68628',
                shadowOffset: { width: 0, height: 2 },  
                shadowOpacity: 0.3,
                shadowRadius: 3,  
              }}
            >
              <Ionicons name="add" size={30} color="#00318D" />
            </View>
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
    </Tabs>
  );
}
