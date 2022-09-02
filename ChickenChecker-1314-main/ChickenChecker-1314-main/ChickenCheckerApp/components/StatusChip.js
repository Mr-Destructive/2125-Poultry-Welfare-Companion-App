import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, FAB } from 'react-native-elements';


export default function StatusChip({fillColor, title, iconName, iconType}) {

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
                color: 'white',
              }}



        />    
        </View>
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