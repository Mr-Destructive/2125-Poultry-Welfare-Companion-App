import React, { useState } from 'react';
import { Overlay, Icon, Input } from 'react-native-elements';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CustomButton from './CustomButton';
import axios from "axios";

const AddFarmOverlay = (props) => {

  const [visible, setVisible] = useState(false);
  const [farmid, setFarmID] = useState('');
  const [farmeremail, setFarmerEmail] = useState('');

  // get complexID to reference in axios.get(url,...)
  const complexID = props.route

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const setEmail = (value) => {
    setFarmerEmail(value);
  };

  const setFarm = (value) => {
    setFarmID(value);
  };

  const addFarm = () => {  
    // make a get request for url (ex: http://localhost:8000/core/integrator/complex/4)
    axios.post(`${global.baseURL}core/integrator/complex/${complexID}/add/farm`,{
      params: {
        farmeremail: farmeremail,
        farmname: farmid
      }
    }).then((response) => {
      // reload the data
      props.farmHandler();
      setVisible(!visible);
      console.log(response);
    });
  
  };

  return (
      <View>
        <TouchableOpacity style={styles.item} onPress={toggleOverlay}>
          <Text style={styles.itemText}>
            Add More
          </Text>
        </TouchableOpacity>
  
        <Overlay overlayStyle={styles.container} isVisible={visible} onBackdropPress={toggleOverlay}>
          <View>
            <View style={styles.inputContainer}>
              <Input
                  style={styles.input} 
                  placeholder='Farmer Email'
                  onChangeText={(value)=>setEmail(value)}/>
              <Input
                  style={styles.input} 
                  placeholder='Farm Name'
                  onChangeText={(value)=>setFarm(value)}/>
              <CustomButton
                  title="Add Farm"
                  color='rgba(111, 202, 186, 1)'
                  onPress={() => {
                    console.log("Add farm button pressed");
                    addFarm();
                  }}/>
            </View>
          </View>
        </Overlay>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 300,
  },
  item: {
    // alignSelf: 'center',
    width: 100,
    height: 40,
    // padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#99EE90',
    borderRadius: 20,
    marginLeft: 15,
  },
  itemText: {
    // maxWidth: '80%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
  inputContainer: {
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

export default AddFarmOverlay;