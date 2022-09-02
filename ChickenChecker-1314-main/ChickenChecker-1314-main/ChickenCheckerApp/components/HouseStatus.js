import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import StatusChip from './StatusChip';
import ChipNav from './ChipNav';
import { color } from 'react-native-elements/dist/helpers';

const colorLookup = {
    0 : '#000000',
    1 : '#00A400',
    2 : '#00FF00',
    3 : '#FFFF00',
    4 : '#FFA700',
    5 : '#FF0000'
};

const HouseStatus = ({id, title, data, route}) => {
    
    const [selected, setSelected] = useState(false);

    const avgBroiler = 47; // days
    let date = new Date(data[1]);
    console.log(date);
    let elapsedDays = parseInt((Date.now() - date) / 1000 / 60 / 60 / 24); // ms -> days
    console.log(elapsedDays);
    let difference = avgBroiler - elapsedDays;
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

    return (
        <>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelected(!selected)} style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                    <Text>
                        <Icon name="home" size={30} color="#000000"/>
                    </Text>
                </View>                
            </View>
            <Text style={styles.itemText}>{title}</Text>
            <View style={styles.itemRight}>
                <View style={styles.iconContainer}>
                    {selected ? 
                        <>
                        <Text>
                            <Icon name="chevron-up" size={30} color="#000000"/>
                        </Text>
                        

                        </>
                    : 
                     <>
                        <Text>
                            <Icon name="chevron-down" size={30} color="#000000"/>
                        </Text>
                        </>
                    }
                    
                    
                </View>                
            </View>

        </TouchableOpacity>
        <View style={styles.opened}>
            {selected && 
            <>
                {/* the little circles */}
                <StatusChip fillColor={colorLookup[flockColor]} title={'Flock Age'} data={data[1]}/>
                <StatusChip fillColor={colorLookup[data[0]]} title='Status Level' data={data[0]}/>

                <ChipNav 
                    fillColor={'#C4C4C4'} 
                    title='House View' 
                    iconName='arrowright' 
                    iconType='antdesign'
                    route={route}
                    params={{
                        houseid: id,
                        date: date,
                        elapsed: elapsedDays,
                        baseURL: `${global.baseURL}core/`,
                        statusAge: flockColor,
                        status: data[0],
                        title: title,
                        }}
                />

            </>
            }
        </View>
                    
    </>
    )
}

// house button/drop down
// on click - open accordian (?) with openView
// openView has flock age display thing, status level display thing, house view button

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#6AC1DD',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
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
        fontWeight: 'bold',
        color: '#FFF'
        // alignItems: 'center'
    },
    opened: {
        flexDirection:'row',
        justifyContent: 'center',
        paddingBottom: 20
    },
});

export default HouseStatus;