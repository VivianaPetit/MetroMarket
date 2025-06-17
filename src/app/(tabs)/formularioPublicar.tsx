import { Entypo, Fontisto, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useRouter } from 'expo-router';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/userContext'; 


export default function Formulario(){
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <TouchableOpacity 
                    onPress={() => router.push('/publicaciones')}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#00318D" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    <Text style={{ color: '#00318D', fontWeight: 'bold' }}>Crear Publicación</Text>
                </Text>
                <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/perfil')}>
                    <Ionicons name="person-outline" size={24} color="#00318D" />
                </TouchableOpacity>
            </SafeAreaView>
            <View style={styles.containerList}>
                <Text style={styles.headerInstruccion}>Seleccione el tipo de publicación que desea crear</Text>
                {/*este llevara al formulario de publicaciones de tipo producto */}
                <TouchableOpacity
                    style={styles.menuButton}
                    // verifica si el usario esta logeado
                    onPress={() => {
                        if (!user){
                            Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero para realizar esta acción');
                            return;
                        }
                        router.push({
                            pathname: '../publicar',
                            params: { tipoPublicacion: 'producto' } // Parámetro para producto
                        });
                    }}
                    activeOpacity={0.8}
                    >
                    <View style={styles.publicationsButtonContent}>
                        <Entypo name="box" size={24} color="#FF8C00" />
                        <Text style={styles.publicationsButtonText}>Producto</Text>
                    </View>
                </TouchableOpacity>
                {/* este llevara al formulario de publicaciones de tipo servicio */}
                <TouchableOpacity
                    style={styles.menuButton}
                    // verifica si el usario esta logeado
                    onPress={() => {
                        if (!user){
                            Alert.alert('Acceso denegado', 'Debes iniciar sesión o registrarte primero para realizar esta acción');
                            return;
                        }
                        router.push({
                            pathname: '../publicar',
                            params: { tipoPublicacion: 'servicio' } // Parámetro para servicio
                        });
                    }}
                    activeOpacity={0.8}
                    >
                    <View style={styles.publicationsButtonContent}>
                            <Fontisto name="person" size={24} color="#FF8C00" />
                        <Text style={styles.publicationsButtonText}>Servicio</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerIcon: {
        paddingLeft: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    containerList:{
        flexDirection: 'column',
        alignItems: 'center',
    },
    headerInstruccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    textAlign: 'center', 
    width: '100%', 
    marginTop: 20,
    marginBottom: 20,
    
  },
    backButton: {
        marginRight: 10,
        paddingBottom: 20,
    },
    menuButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
        width: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        height: 70,
    },
    publicationsButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        height: 70,
    },
    publicationsButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
});