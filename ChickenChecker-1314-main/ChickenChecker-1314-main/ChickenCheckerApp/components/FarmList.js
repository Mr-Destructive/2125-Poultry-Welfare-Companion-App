import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import FarmSummary from './FarmSummary'

export default function FarmList({title, content, farmHandler}) {
  console.log(typeof(content));
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subheading}>{content.length} Farms Online</Text>
      </View>


        {content.map((item, i)=>(
            console.log(item),
            <FarmSummary key={item.id} data={item} farmHandler={farmHandler}>

            </FarmSummary>        
        ))}
        
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc'

  },
  
  heading: {
      fontSize: 45,
      fontWeight: '300',
      // fontFamily: 'monospace',
      // textTransform: 'uppercase',
      letterSpacing: -1,
      color:'#111',

  },
  subheading: {
      fontSize: 20,
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      color:'#000',

  },


 

})