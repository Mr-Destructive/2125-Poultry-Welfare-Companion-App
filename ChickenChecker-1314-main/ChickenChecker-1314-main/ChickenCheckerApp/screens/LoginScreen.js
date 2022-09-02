import * as React from 'react';
import axios from "axios";
import { useState, useEffect, component } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, StyleSheet, TextInput, View, } from 'react-native';
import { Button, ButtonGroup, withTheme, Text , Image, Input} from 'react-native-elements';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({navigation}) {

  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  

  async function validate() {
    axios.post(`${global.baseURL}core/`, {
    params: {
      user: username,
      pass: password
      }
    })
    .then(function (response) {
      console.log(response.data)
      console.log(response.data['groups'][0]['name'])
      const group = response.data['groups'][0]['name']
      if (group == 'farmer') {
        navigation.navigate("Farm View", {
          userid: response.data['id'],
          user: response.data
        })
      } else {
        navigation.navigate("Complex Management", {
          userid: response.data['id'],
          user: response.data
        })
      }

    }).catch(function (error) {
      console.log(error);
      if (error.response.status == 404) {
        alert("Username does not exist in the database")
        console.log("Incorrect username")
      }
      if (error.response.status == 400) {
        alert("Password does not exist in the database")
        console.log("Incorrect Password")
      }
    });
  }
  
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.main}>
        <Image source={require('../assets/chicken-icon.png')} style = {styles.logo}>
        </Image>
        <Text style={styles.text}>
          Welcome to ChickenChecker
        </Text>
      </View>
      <View>
        <View style={styles.userpass}>
          <Input
              style={styles.input} 
              autoCapitalize="none"
              placeholder='Username'
              onChangeText={(value)=>setUsername(value)}/>
              
          <Input
              style={styles.input} 
              placeholder='Password'
              autoCapitalize="none"
              secureTextEntry={true} 
              onChangeText={(value)=>setPassword(value)}/>
              <CustomButton
                title="Log in"
                color='rgba(111, 202, 186, 1)'
                onPress={validate}
              />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems:'center',
  },
  main: {
    alignItems:'center',
    marginTop: 40,
  },
  
  logo: {
    width: 100,
    height: 100,
    margin: 10
  },
  text: {
    fontSize: 30,
    fontFamily: 'Avenir',
    paddingHorizontal: 20,
    textAlign: 'center'
  },

  userpass: {
    flexDirection: 'column',
    paddingTop: 50,
    alignItems: 'center',

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
