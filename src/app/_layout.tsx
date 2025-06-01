import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const theme = useColorScheme(); 

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#F68628' : '#fff' }}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Slot /> 
      </SafeAreaView>
  );
}
