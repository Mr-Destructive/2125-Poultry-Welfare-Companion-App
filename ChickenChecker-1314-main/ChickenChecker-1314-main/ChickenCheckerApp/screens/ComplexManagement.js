// Complex View: shows list of Complexes
// Analogous with FarmView

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity
} from 'react-native';
import StatusItem from '../components/StatusItem';
import { Icon, FAB } from 'react-native-elements';
import * as IconEntypo from 'react-native-vector-icons/Entypo';
import axios from "axios";
import Header from '../components/Header';


export default function ComplexManagement({ navigation, route }) {
  const user = route.params['user']
  const userID = route.params['userid']
  const [complexes, setComplexes] = useState({});
  const [isLoading, setLoading] = useState(true);
        
  useEffect(() => {
    getComplexes();
  }, []);

  const getComplexes = () => {
    axios.get(`${global.baseURL}core/integrator/${userID}`).then((response) => {
      console.log(response.data)
      setComplexes(response.data);
      setLoading(false);
    });
  };
  

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
  <View style={styles.container}>
    <Header params={user} route="Settings"/>
    <View style={styles.complexWrapper}>
      <View style={styles.header}>
        <Text style={[styles.c1, styles.itemText]}>Status</Text>
        <Text style={[styles.c2, styles.itemText]}>Complex</Text>
        <Text style={[styles.c3, styles.itemText]}>Farms</Text>
        <Text style={[styles.c4, styles.itemText, styles.itemRight]}>Go to View</Text>

      </View>
      <View style={styles.items}>
        {complexes.map((item)=>(
            <StatusItem 
            key={item.id}
            type={"complex"}
            params={item}
            route={"Complex View"}/>        
        ))} 
      </View>
    </View>
  </View>    
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    complexWrapper: {
      paddingTop: 80,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    items: {
      marginTop: 30
    },
    header: {
        backgroundColor: '#6AC1DD',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    itemText: {
        maxWidth: '80%',
        fontSize: 20,
        // fontWeight: 'bold',
        color: '#000'
        // alignItems: 'center'
    },
    c1: {
        flex: 1,
    },
    c2: {
        flex: 4
    },
    c3: {
        flex: 1
    },
    c4: {
        flex: 1
    },
})