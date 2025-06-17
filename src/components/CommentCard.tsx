import React from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


const CommentCard = ({
  UserName = "Usuario",
  imagen = require('../../assets/images/user.png'),
  commentText = "Comment" 
  
}: {
  UserName?: string;
  imagen?: any;
  commentText?:string;
  
}) => {
  const router = useRouter();
  return (
  <View style={styles.CommentBox}>
          <View style={[styles.circleContainer,{borderColor:'black',width:60,height:60}]}><Image source={imagen} style={styles.avatarImage} /> </View> 
          
          <View>
            <TouchableOpacity 
          onPress={() => router.push({ 
            pathname: '../perfil/[username]',
            params: { username: UserName },

          })}
        >
            <View style={{marginTop:10}}><Text style={{fontWeight:'bold'}}>{UserName}</Text></View></TouchableOpacity>
            <View style={styles.comment}><Text>{commentText}</Text></View>
          </View>
  
        </View>)}

export default CommentCard;


const styles = StyleSheet.create({

    CommentBox: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%', 
  },
  comment:{
    marginTop:7,
    marginRight:5,
    width:'90%',
    backgroundColor:'#F6F6F6',
    padding:4,
    borderRadius:5},

  circleContainer: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  }}
)