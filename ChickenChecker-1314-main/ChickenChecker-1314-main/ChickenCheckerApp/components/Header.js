import React from 'react';
import {
    View,
    Pressable,
    Text,
    StyleSheet,
    ShadowPropTypesIOS,
} from 'react-native';
import Chip from './Chip';
import { Icon, Button, withTheme } from 'react-native-elements';

const Header = (props) => {

    console.log(props.params)
    
    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                
            </View>
                <Chip style={styles.itemRight}
                    fillColor={'#6AC1DD'} 
                    // title='House View' 
                    iconName='cog' 
                    iconType='entypo'
                    route={props.route}
                    params={props.params}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#6AC1DD',
        // padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 65
        // marginBottom: 20,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        margin: 0
    },
    text: {
        color: '#ffffff',
        fontSize: 20,
        margin: 10,
        textAlign: 'center',
    },
})

export default Header;