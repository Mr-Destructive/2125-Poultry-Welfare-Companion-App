import React, { useState, useEffect,  } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import { TabRouter } from '@react-navigation/native';
import Header from '../components/Header';
import LottieView from 'lottie-react-native';
import CustomButton from '../components/CustomButton';
import axios from "axios";

// import RCTAnimation from 'react-native-animation-library';

function HouseView({ route,  navigation }) {
  console.log("House View")
  console.log(route.params);
  const user = route.params['user'];
  
  const id = route.params["id"];
  console.log(id)
  const status = route.params["status"];
  const farmid = route.params["farm"];
  const length = route.params["length"];
  const width = route.params["width"];
  const doorCount = route.params["doorCount"];
  const monitorCount = route.params["monitorCount"];
  const lastFlockEntry = route.params["lastFlockEntry"];
  const flockAge = route.params["flockAge"];
  const heatmapJson = route.params["heatmapJson"];
  const elapsedLabel = flockAge != 0 ? `${flockAge}` : "Inactive";
  

  // const [heatmap, setHeatmap] = useState({});
  const [isLoading, setLoading] = useState(true);
  // const heatmapGIF = ;
            
    useEffect(() => {
      heatmapGen();
    }, []);

    const heatmapGen = () => {
        axios.get(`${global.baseURL}core/farmer/house/${id}`).then((response) => {
        console.log("REQ");
        // console.log(response.data)
      });
      setLoading(false);
    };

    const reportRequest = () => {
      console.log("blackbird")
      axios.get(`${global.baseURL}core/report/house/${id}`).then((response) => {
        Linking.openURL(`${global.baseURL}${response.data}`)
        console.log(response.data)
      });
    };

    if (isLoading) {
      return <View className="App"></View>;
    }

   return (
    // Add houseView
    <SafeAreaProvider styles={styles.container}>
      <Header params={user} route="Settings"/>
      <View style={styles.main}>
            <View >
              <Image
                style={styles.heatmap}
                source={{uri: `${global.baseURL}visuals/houses/5/maps/heatmap.gif`}}
              />
            </View>
            <View style={styles.right}>
              <View style={styles.sub}>
                <Text style={styles.title}>
                  House A
                </Text>
                <Text style={styles.text}>
                  Status Level: {status}
                </Text>
                <Text style={styles.text}>
                  Flock Age: {elapsedLabel} days
                </Text>
                <Text style={styles.text}>
                  House Dimensions: {width}' x {length}'
                </Text>
                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.button}>
                      <Text style={styles.text}>
                        Nightly Summary
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                      <Text style={styles.text}>
                      Snicks/Time
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}
                  onPress={reportRequest}>
                      <Text style={styles.text}>
                      Detailed Report
                      </Text>
                  </TouchableOpacity>
                </View>

              </View>
              <Image
                style={styles.img}
                source={require('../assets/LEGEND.png')}
              />
            </View>
            

            {/* <View style={styles.houseContainer}></View> */}
      
      </View>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    fontFamily: "Avenir",
    alignItems: "center"
  },
  text: {
    fontSize: 15,
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  main: {
    flexDirection: 'row',
    height: '80%',
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: 'auto',
  },
  heatmap: {
    resizeMode: 'cover',
    flexGrow: 1,
    marginRight: 0,
    padding: 26
  },
  img: {
    margin: 0,
    marginLeft: 10
  },
  sub: {
    flex: 1,
    padding: 10,
    backgroundColor: '#E5F7FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6AC1DD',
    borderRadius: 5,
    margin: 3,
    padding: 5,
    minWidth: 150,
  },
  buttons: {
    paddingTop: 90,
  },
  right: {
  }
})

export default HouseView;