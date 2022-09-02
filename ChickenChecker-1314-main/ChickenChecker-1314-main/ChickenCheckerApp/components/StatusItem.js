import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Chip from './Chip';
import { color } from 'react-native-elements/dist/helpers';
import { Icon, FAB } from 'react-native-elements';
import CircularProgressIndicator from './CircularProgressIndicator';

const StatusItem = ({type, params, route}) => {
    const [selected, setSelected] = useState(false);
    
    const flockAge = params.flockAge;
    const status = params.status;

    // create flock status color dictionary
    if (type == "house") {
        let difference = 47 - params.flockAge;
        console.log(difference);
        let flockColor = 0; // Implicitly set to bad range
        if (difference > 0) {
            flockColor = 5;
        }
        if (Math.abs(difference) <= 25) {
            flockColor = 5;
        }
        if (Math.abs(difference) <= 20) {
            flockColor = 4;
        }
        if (Math.abs(difference) <= 15) {
            flockColor = 3;
        }
        if (Math.abs(difference) <= 10) {
            flockColor = 2;
        }
        if (Math.abs(difference) <= 5) {
            flockColor = 1;
        }
        
        const styles = houseStyles;

        return(      
        <>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelected(!selected)} style={styles.item}>
            {/* house icon */}
            <Icon style={[styles.itemLeft, styles.iconContainer]} name="home" size={30} color="#000000"/>
            
            {/* title */}
            <Text style={styles.itemText}>{`House ${params.id}`}</Text>
            
            {/* chevron icon, flip when selected changes */}
            <View style={[styles.itemRight, styles.iconContainer]}>
                    {selected ? 
                        <>
                        <Text>
                            <Icon name="chevron-up" type='entypo' size={30} color="#000000"/>
                        </Text>
                        

                        </>
                    : 
                     <>
                        <Text>
                            <Icon name="chevron-down" type='entypo' size={30} color="#000000"/>
                        </Text>
                        </>
                    }
            </View>

        </TouchableOpacity>
        <View style={styles.opened}>
            {selected && 
            <>
                {/* the little circles */}

                {/* Flock Age Indicator */}
                <CircularProgressIndicator 
                    title={"Flock Age"} 
                    fill={flockAge} 
                    color={global.colorLookup[flockColor]} 
                    value={flockAge} 
                />
                {/* Status Indicator */}
                <CircularProgressIndicator 
                    title={"Status Level"} 
                    fill={status*20} 
                    color={global.colorLookup[status]} 
                    value={status} 
                />

                <Chip 
                    fillColor={'#C4C4C4'} 
                    title='House View' 
                    iconName='arrowright' 
                    iconType='antdesign'
                    route={route}
                    params={params}
                    arrowcolor={'white'}
                />

            </>
            }
        </View>           
        </>
    )
    }
    if (type == "complex") {
        const styles = complexStyles;
        return(
            <>
            
            <View style={[styles.item, { color: global.colorLookup[params.status]}]}>
                <Chip fillColor={global.colorLookup[params.status]} size={"small"} />
      
                <Text style={[styles.c2, styles.itemText]}>{params.name}</Text>
                <Text style={[styles.c3, styles.itemText]}>{params.farmCount}</Text>
    
                <Chip 
                    style={styles.c4}
                    fillColor={'#C7F1FF'} 
                    title='' 
                    iconName='arrowright' 
                    iconType='antdesign'
                    route={route}
                    params={params}
                    arrowcolor={'black'}
                />
                
            </View>
            </>
   
        )

    }

}

const houseStyles = StyleSheet.create({
    item: {
        backgroundColor: '#E5F7FE',
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
        // fontFamily: 'Roboto-regular',
        maxWidth: '80%',
        fontSize: 20,
        // fontWeight: 'bold',
        color: '#000'
        // alignItems: 'center'
    },
    opened: {
        paddingTop: 20,
        flexDirection:'row',
        justifyContent: 'center',
        paddingBottom: 20
    },
    progressContainer: {
        alignItems: 'center',
        paddingHorizontal: 20
    },
    text: {
        paddingBottom: 5,
        fontSize: 12,
        textTransform: 'uppercase',
    }
});

const complexStyles = StyleSheet.create({
    item: {
        backgroundColor: '#E1F8FF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30
        // borderWidth: 1,
        // borderColor: '#e2e2e2'
    },
    itemText: {
        // fontFamily: 'Roboto-regular',
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

});

export default StatusItem;