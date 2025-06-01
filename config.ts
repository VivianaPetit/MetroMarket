// Para guardar la ip local de cada maquina donde se corra el proyecto 
import Constants from 'expo-constants';

const { manifest } = Constants;

const LOCAL_IP = "192.168.68.109"; // Aqui va la ip de tu compu 

export const API_BASE_URL = `http://${LOCAL_IP}:3000/api`;
