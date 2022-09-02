import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import {
    Input,
    Text,
    ListItem,
    Avatar,
    Icon,
    Badge,
    ListItemProps,
    Button,
    Switch,
    colors
} from 'react-native-elements';
import LoginScreen from '../LoginScreen';
import CustomButton from '../../components/CustomButton';
import axios from "axios";

export default function UserPreferences({navigation, route}) {

    const [username, setUsername]=useState('');

    console.log(route.params);

    async function updateUsername() {
        axios.post(`${global.baseURL}core/update_username`, {
        params: {
          old_username: route.params.user.username,
          new_username: username,
          }
        })
        .then(function (response) {
          console.log(response.data)
          route.params.user.username = response.data
        }).catch(function (error) {
          console.log(error);
        });
    }

    return (
        <View style={styles.main}>
            <Text style={styles.text}>User Preferences</Text>
            <Input
              style={styles.input} 
              placeholder='New Username'
              onChangeText={(value)=>setUsername(value)}/>
              <CustomButton
                title="Change username"
                color='rgba(111, 202, 186, 1)'
                onPress={updateUsername}
              />
        </View>
      
    );
};

const styles = StyleSheet.create({
    container: {
      alignItems:'center',
    },
    text: {
      color: '#D3D3D3',
      fontSize: 64,
      marginBottom: 30
    },
    main: {
        flexDirection: 'column',
        // paddingTop: 50,    
    },
    input: {
      height: 35,
      width: 350,
      borderColor: '#555',
      borderRadius: 10,
      backgroundColor: '#ffffff',
      textAlign: 'center',
      fontSize: 20,
      marginBottom: 10,
      paddingHorizontal: 0 
    }
  
});