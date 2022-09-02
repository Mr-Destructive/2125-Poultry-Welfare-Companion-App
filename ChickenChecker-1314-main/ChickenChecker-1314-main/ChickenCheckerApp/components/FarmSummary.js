import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import axios from "axios";

export default function FarmSummary({data, farmHandler}) {
    const [selected, setSelected] = useState(data.selected);
    console.log(data.name);

    const deleteFarm = () => {
      
      // make a get request for url (ex: http://localhost:8000/core/integrator/complex/4)
      axios.post(`${global.baseURL}core/integrator/complex/delete/farm/${data.id}`).then((response) => {
        farmHandler();
        console.log(response);
      });
      
    };

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelected(!selected)}  >
          <View style={styles.card}>
            <Text style={styles.heading}>{data.name}</Text>
            <View style={[styles.indicator, {backgroundColor: global.colorLookup[data.status]}]}/>

          </View> 


          <View style={styles.details}>
              { selected && 

              <>
                <View style={styles.detailItem}>
                  <Text style={styles.bodyKey}>{"Owner"}: </Text>
                  <Text style={styles.bodyValue}>{data.user.first_name} {data.user.last_name}</Text>
                </View>
                <Divider inset={true} insetType="middle" />
                <View style={styles.detailItem}>
                  <Text style={styles.bodyKey}>{"Contact"}: </Text>
                  <Text style={styles.bodyValue}>{data.user.email}</Text>
                </View>
                <Divider inset={true} insetType="middle" />
                <View style={styles.detailItem}>
                  <Text style={styles.bodyKey}>{"Location"}: </Text>
                  <Text style={styles.bodyValue}>{data.lat +", "+ data.long }</Text>
                </View>
                <Divider inset={true} insetType="middle" />
                <View style={styles.detailItem}>
                  <Text style={styles.bodyKey}>{"Houses"}: </Text>
                  <Text style={styles.bodyValue}>{data.houseCount}</Text>
                </View>
                <Divider inset={true} insetType="middle" />
                
                <View style={styles.item}>
                  <View style={styles.detailItem}>
                    <Text style={styles.bodyKey}>{"Analysis"}: </Text>
                  </View>

                  <TouchableOpacity style={styles.itemRight}>
                    <Text style={styles.itemText}>
                      Farm Report
                    </Text>
                  </TouchableOpacity>
                </View>
                <Divider inset={true} insetType="middle" />
                <View style={styles.item}>
                  <View style={styles.detailItem}>
                    <Text style={styles.bodyKey}>{"Remove from Complex"}: </Text>
                  </View>
                  <TouchableOpacity style={styles.removeButton} onPress={deleteFarm}>
                    <Text style={styles.itemText}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
               </>
  
              }
    
          </View>
        </TouchableOpacity>


  );
}


const styles = StyleSheet.create({
  
  heading: {
      // fontSize: 38,
      // fontWeight: '900',
      // letterSpacing: -1
      maxWidth: '80%',
      fontSize: 20,
      color: '#000',

  },
  detailItem: {      
    flexDirection:'row',

  },
 
  bodyKey: {
      fontSize: 20,
      fontWeight: '500',

  },
   bodyValue: {
      fontSize: 20,
      fontWeight: '300',
      marginLeft: 'auto',

  },
  card: {
    backgroundColor: '#E1F8FF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15
  },
  
  indicator: {
    width: 30,
    height: 30,
    margin: 5,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    marginLeft: 'auto',

  },
  details: {
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#fff'
  },
  level1: {
    backgroundColor: '#84ff6b',
  },
  level2: {
    backgroundColor: '#ffc',
  },
  level3: {
    backgroundColor: '#ffce6b',
  },
  level4: {
    backgroundColor: '#ff4',
  },
  level5: {
    backgroundColor: '#ff4747',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    width: '50%'
  },
  removeButton: {
    // alignSelf: 'center',
    width: 200,
    height: 40,
    // padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: 'red',
    borderRadius: 20
  },
  itemLeft: {
    // alignSelf: 'center',
    width: 200,
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
    width: 200,
    height: 40,
    // padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#99EE90',
    borderRadius: 20
  },
  itemText: {
    // maxWidth: '80%',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
})