import { Ionicons, Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';
import { useRouter, useSegments } from 'expo-router';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

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
                        tabBarIcon: ({ focused, size, color }) => (
                            <View style={styles.iconContainer}>
                                <Octicons name="home" size={30} color={color} />
                                {focused && <View style={styles.activeIndicator} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="favoritos"
                    options={{
                        tabBarShowLabel: false,
                        title: 'Favoritos',
                        tabBarIcon: ({ focused, size, color }) => (
                            <View style={styles.iconContainer}>
                                <Ionicons name="heart-outline" size={32} color={color} />
                                {focused && <View style={styles.activeIndicator} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="formularioPublicar"
                    options={{
                        tabBarShowLabel: false,
                        title: 'formularioPublicar',
                        tabBarIcon: ({ focused, size, color }) => (
                            <View style={styles.iconContainer}>
                                <Ionicons name="add" size={32} color={color} />
                                {focused && <View style={styles.activeIndicator} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="publicaciones"
                    options={{
                        tabBarShowLabel: false,
                        title: 'Publicaciones',
                        tabBarIcon: ({ focused, size, color }) => (
                            <View style={styles.iconContainer}>
                                <Ionicons name="grid-outline" size={30} color={color} />
                                {focused && <View style={styles.activeIndicator} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="menu"
                    options={{
                        tabBarShowLabel: false,
                        title: 'Menu',
                        tabBarIcon: ({ focused, size, color }) => (
                            <View style={styles.iconContainer}>
                                <Ionicons name="menu" size={32} color={color} />
                                {focused && <View style={styles.activeIndicator} />}
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="publicar"
                    options={{
                        href: null,
                        tabBarShowLabel: false,
                        title: 'publicar',
                    }}
                />  
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
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
        marginBottom: 60,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
    },
activeIndicator: {
        position: 'absolute',
        top: -23, // Ajusta según la altura de tu tab bar
        width: '150%',
        height: 3,
        backgroundColor: '#00318D',
        borderRadius: 2,
    },
});