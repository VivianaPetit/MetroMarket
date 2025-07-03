import { Slot, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../context/userContext';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  const theme = useColorScheme(); 
  const router = useRouter();

  useEffect(() => {
    // Escuchar cuando se toca la notificación
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { data } = response.notification.request.content;

        if (data.tipo === 'nueva-orden') {
          // Navegar a la pantalla de "mis-ventas" con parámetros
          router.push({
            pathname: '/ventas',
          });
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#F68628' : '#fff' }}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Slot /> 
      </SafeAreaView>
    </AuthProvider>
  );
}

