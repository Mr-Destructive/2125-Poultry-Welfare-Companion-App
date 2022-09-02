import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { Icon, FAB } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


export default function ChipNav({fillColor, title, iconName, iconType, route, params}) {

  const navigation = useNavigation();

  console.log({route});
  console.log({params});

  return (
    <TouchableOpacity 
              title={title}
            style={styles.container}>
      <Text style={styles.text}>
        {title}
      </Text>
      <FAB
        onPress={() => {
          navigation.navigate(route, params)
        }}
        visible={true}
        color={fillColor}
        icon={{
              name: iconName,
              type: iconType,
              size: 25,
              color: 'white',
            }}
      />    
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingHorizontal: 20
    },
    text: {
      paddingBottom: 5,
      fontSize: 12,
      textTransform: 'uppercase'
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    items: {
      marginTop: 30
    },
})