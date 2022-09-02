import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { Icon, FAB } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


export default function Chip({nav, fillColor, title, iconName, iconType, size, route, params}) {

  
  const navigation = useNavigation();
  if (title == null) {
    title == '';
  }
  
  if (fillColor == null) {
    fillColor = '#C7F1FF';
  }
  if (iconName == null && iconType == null) {
    iconName = (nav ? 'arrowright' : '');
    iconType = (nav ? 'antdesign' : '')
  }
  if (title == null ) {
    title = '';
  }
  const arrowcolor = 'black';
  

  // status chip takes fillcolor, title, iconName, 
  // STATUS CHIP
  if (route == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {title}
        </Text>
        <FAB
          visible={true}
          color={fillColor}
          icon={{
                name: iconName,
                type: iconType,
                size: 25,
                color: arrowcolor,
              }}
          size={size}
        />    
      </View>
    );
  }



  // NAV CHIP
  // REQUIRES nav == true + 
  // if route != null -> need nav, hence use nav
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
            color: arrowcolor,
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