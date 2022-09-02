// Parallel with ComplexManagement
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Header from '../components/Header';
import StatusItem from '../components/StatusItem';
import NightlySummary from '../components/NightlySummaryOverlay';
import { Icon, FAB, Text } from 'react-native-elements';
import * as IconEntypo from 'react-native-vector-icons/Entypo';
import axios from "axios";
import NightlySummaryOverlay from '../components/NightlySummaryOverlay';

export default function FarmView({ navigation, route }) {
    console.log("Farm View")
    console.log(route.params)
    const user = route.params['user']
    const userID = route.params['userid']
    const [houses, setHouses] = useState({});
    const [isLoading, setLoading] = useState(true);
    console.log(userID)

    
    useEffect(() => {
        getHouses();
    }, []);

    const getHouses = () => {
        axios.get(`${global.baseURL}core/farmer/${userID}`).then((response) => {
        console.log("hey");
        console.log(response.data)
        setHouses(response.data);
        setLoading(false);
        });
    };

    if (isLoading) {
        return <View className="App"></View>;
    }
    console.log(houses[0]);

    return (
    <View style={styles.container}>
        <Header params={user} route="Settings"/>
        <View style={styles.homeWrapper}>
            <View style={styles.items}>
                <Text style={styles.text}>
                    {user.first_name}'s Farm View
                </Text>
                <NightlySummaryOverlay/>
                {houses.map((item, id)=>(
                    <StatusItem 
                    key={item.id}
                    type={"house"}
                    params={item} 
                    route={"House View"}/>        
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
    homeWrapper: {
      paddingTop: 15,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    items: {
      marginTop: 30
    },
    text: {
      color: '#D3D3D3',
      fontSize: 40,
      textAlign: 'center',
      marginBottom: 20
    },
    progressText: {
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.7)',
    },
})