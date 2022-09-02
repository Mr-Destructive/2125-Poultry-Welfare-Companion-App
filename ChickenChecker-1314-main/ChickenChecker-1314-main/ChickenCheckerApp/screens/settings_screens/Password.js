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
import { color } from 'react-native-elements/dist/helpers';

export default function Password({navigation, route}) {

    const [password, setPassword]=useState('');
    const [valid, setValid]=useState(true);
    const [errorMessage, setErrorMessage]=useState('');

    console.log(route.params);

    async function updatePassword() {
        axios.post(`${global.baseURL}core/update_password`, {
        params: {
          username: route.params.user.username,
          new_password: password,
          }
        })
        .then(function (response) {
          console.log(response.data)
          route.params.user.password = response.data
        }).catch(function (error) {
          console.log(error);
        });
    }

    async function validatePassword() {
        axios.post(`${global.baseURL}core/validate_password`, {
        params: {
          user: route.params.user.username,
          pass: password,
          }
        })
        .then(function (response) {
          //console.log(response.data)
          setValid(response.data);
          //console.log(valid);
        }).catch(function (error) {
          console.log(error);
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Password Settings</Text>
            <Input
              style={styles.input} 
              placeholder='Old Password'
              onChangeText={(value)=>validatePassword(value)}
              errorStyle={{ color: 'red' }}
              errorMessage={errorMessage}
              
            />
            <Input
              style={styles.input} 
              placeholder='New Password'
              onChangeText={(value)=>setPassword(value)}
            />
            <CustomButton
                title="Change password"
                color='rgba(111, 202, 186, 1)'
                onPress={() => {
                    if (valid)
                    {
                        updatePassword;
                        console.log('Updated password successfully.');
                    }
                    else
                        setErrorMessage('Incorrect Password');
                        console.log('False');
                    
                }}
            />
        </View>
      
    );
};

const styles = StyleSheet.create({
    container: {
    // paddingTop: 50,
    //   flex: 1,
      flexDirection: 'column',
    },
    errorText: {
      color: 'red'
    },
    text: {
      color: '#D3D3D3',
      fontSize: 64,
      marginBottom: 30
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