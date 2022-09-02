import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import StatusChip from './StatusChip';
import ChipNav from './ChipNav';

const ComplexStatus = ({id, title, data, route}) => {
    
    const [selected, setSelected] = useState(false);


    return (
        <>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelected(!selected)} style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                    <Text>
                        <Icon name="grid" size={30} color="#000000"/>
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
                <StatusChip fillColor={'#59D466'} title='Status Level' data={data.status}/>
                <ChipNav 
                    fillColor={'#C4C4C4'} 
                    title='Complex View' 
                    iconName='arrowright' 
                    iconType='antdesign'
                    route={route}
                    params={{
                        complexid: id,
                        baseURL: `${global.baseURL}core/`,
                        loc: data,
                        name: title
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

export default ComplexStatus;