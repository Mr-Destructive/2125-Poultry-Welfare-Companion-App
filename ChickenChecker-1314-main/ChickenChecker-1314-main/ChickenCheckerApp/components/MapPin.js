import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';


export default function MapPin({data}) {
    const [selected, setSelected] = useState(false);
    const statusStyles = {1: styles.level1, 2: styles.level2, 3: styles.level3}
    


    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelected(!selected)} style={{right: data.pin.x, top: data.pin.y}} >
            <Icon
              name='map-pin'
              type='font-awesome-5'
              size={50}
              style={styles.pin}
              iconStyle={statusStyles[data.details.status]}
            />

           
         
        </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
 
  pin: {

  },
  level1: {
    color: '#84ff6b',
  },
  level2: {
    color: '#ffce6b',
  },
  level3: {
    color: '#ff4747',
  }


})