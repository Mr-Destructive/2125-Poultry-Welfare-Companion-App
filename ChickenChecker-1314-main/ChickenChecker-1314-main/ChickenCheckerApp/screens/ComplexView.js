import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import FarmList from '../components/FarmList'
// import MapPin from '../components/MapPin'
import MapView from 'react-native-web-maps';
import axios from "axios";
import AddFarmOverlay from '../components/AddFarmOverlay';
import Header from '../components/Header';


export default function ComplexView({ route, navigation }) {
  const user = route.params['user']
  // route prop is passed in by ChipNav component and specified by ComplexStatus component in the ComplexManagement Screen
  console.log(route);
  const data = route.params
  // get complexID to reference in axios.get(url,...)
  const complexID = route.params.id;

  // create state variable for farm list for complex id
  const [farms, setFarms] = useState({});
  // loading state variable to ensure component renders after response is received
  const [isLoading, setLoading] = useState(true);
        
  // React Hook to use data fetch as a "side effecT"?
  useEffect(() => {
    getFarms();
  }, []);

  // get farms using axios
  const getFarms = () => {
    // make a get request for url (ex: http://localhost:8000/core/integrator/complex/4)
    axios.get(`${global.baseURL}core/integrator/complex/${complexID}`).then((response) => {
      //assign request response data to farms variable using state
      console.log("farms");
      console.log(response.data)
      setFarms(response.data);
      //data has loaded
      setLoading(false);
    });
  };
  
  // if data hasn't loaded, render loading instead of blank components
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <SafeAreaProvider style={styles.container_col}>
      <Header params={user} route="Settings"/>
      <View style={styles.container_row}>
        <ScrollView style={styles.sidebar}>
          <FarmList title={data.name} content={farms} farmHandler={getFarms}/>
          <View style={styles.item}>
            <AddFarmOverlay route={complexID} farmHandler={getFarms}/>
          </View>
        </ScrollView>
        <MapView style={styles.main} initialRegion={{
        latitude: parseInt(data.lat),
        longitude: parseInt(data.long),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        }}/>
      </View>
      
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container_row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  container_col: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  main: {
    flex: 7,
    backgroundColor: '#0ff',
    justifyContent: 'center'
  },
  map: {
    flex: 1,
    justifyContent: "center",
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
  },
  heading: {
      fontSize: 38,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: -2

  },
  card: {
    backgroundColor: '#0ff',
    justifyContent: 'center'
  },
  cardContainer: {
    backgroundColor: '#0ff',
    justifyContent: 'center'
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    width: '50%'
  },
  itemLeft: {
    // alignSelf: 'center',
    width: 100,
    height: 40,
    // padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#99EE90',
    borderRadius: 20
  },
  itemRight: {
    // alignSelf: 'center',
    width: 100,
    height: 40,
    // padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#E3242B',
    borderRadius: 20
  },
  itemText: {
    // maxWidth: '80%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },

})

