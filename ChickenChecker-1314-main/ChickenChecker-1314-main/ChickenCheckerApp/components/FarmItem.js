import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Divider } from 'react-native-elements';


export default function FarmItem({data}) {
    const [selected, setSelected] = useState(data.selected);
    const statusStyles = {1: styles.level1, 2: styles.level2, 3: styles.level3, 4: styles.level4, 5: styles.level5}
    const detailKeys = {'farmer': 'Contact', 'status': 'Status Level', 'flockID': 'Flock ID', 'flockStart': 'Flock Start Date'}
    console.log(data.name);


    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelected(!selected)}  >
          <View style={styles.card}>
            <Text style={styles.heading}>{data.name}</Text>

            <View style={[styles.indicator, statusStyles[data.status]]}/>
            
          </View> 


          <View style={styles.details}>
              { selected && 

              <>
                <View style={styles.detailItem}>
                  <Text style={styles.bodyKey}>{"Owner"}: </Text>
                  <Text style={styles.bodyValue}>{data.user.first_name, data.user.last_name}</Text>
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
                  <Text style={styles.bodyValue}>{data.user.first_name, data.user.last_name}</Text>
                </View>
                <Divider inset={true} insetType="middle" />
                
                <View style={styles.item}>
                  <View style={styles.detailItem}>
                    <Text style={styles.bodyKey}>{"Analysis"}: </Text>
                  </View>
                  <TouchableOpacity style={styles.itemLeft}>
                    <Text style={styles.itemText}>
                      House Report
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.itemRight}>
                    <Text style={styles.itemText}>
                      Farm Report
                    </Text>
                  </TouchableOpacity>
                </View>
               </>

              // Object.entries(data.details).map( ([key, value]) => 
              // (
              // <>
              //   <View style={styles.detailItem}>
              //     <Text style={styles.bodyKey}>{detailKeys[key]}: </Text>
              //     <Text style={styles.bodyValue}>{value}</Text>
                  
              //   </View>
              //   <Divider inset={true} insetType="middle" />
              // </>

              }
              
                 
              
          </View>
        </TouchableOpacity>


  );
}


const styles = StyleSheet.create({
  
  heading: {
      fontSize: 38,
      fontWeight: '900',
      letterSpacing: -1

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
    flexDirection: 'row',
    borderBottomWidth: 2,
    padding: 20
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