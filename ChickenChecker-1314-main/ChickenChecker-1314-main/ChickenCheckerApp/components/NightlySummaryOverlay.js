import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Overlay, Icon, Input } from 'react-native-elements';

const NightlySummaryOverlay = ({params}) => {

    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return(
        <View>
            {/* Nightly Summary Overlay Trigger Button */}
            <TouchableOpacity activeOpacity={0.9} onPress={toggleOverlay} style={styles.item}>
                <Text style={styles.itemText}>
                    Nightly Summary
                </Text>
            </TouchableOpacity>

            {/* Overlay definition */}
            <Overlay overlayStyle={styles.overlay} backdropStyle={{color: '525252'}} isVisible={visible} onBackdropPress={toggleOverlay}>
                {/* View container */}
                <View style={styles.container}>
                    {/* Header which contains the 'x' button at top right to close */}
                    <View style={styles.header}>
                        <Button color="transparent" title="X" onPress={toggleOverlay}/>
                    </View>
                    {/* Text Header (ex. Last Night) */}
                    <View style={styles.textHeaderContainer}>
                        <Text style={styles.textHeader}>
                            Last Night
                        </Text>
                    </View>
                    {/* Text Container which contains the main body of text */}
                    <View style={styles.textContainer}>
                        <Text style={styles.itemText}>
                        Summary of the night beginning {/* variable */} 2/1/22 {'\n\n'}
                        The statuses of {/* variable */} one house was
                        elevated due to increased bird noises detected. {'\n\n'}
                        It is recommended that the following are checked for disease: {'\n\n'}
                        </Text>
                    </View>
                    {/* House Status Text */}
                    <View style={styles.statusTextContainer}>
                        <Text style={styles.itemText}>
                        House 5: 1 -{'>'} 2 {'\n'}
                        {/* House 2: 1 -{'>'} 3 {'\n'}
                        House 4: 2 -{'>'} 4 {'\n'} */}
                        </Text>
                    </View>
                    {/* Detailed Report Button */}
                    <View style={styles.buttonContainer} >
                        <TouchableOpacity onPress={() => console.log('View Detailed Report Button Pressed')}>
                            <Text style={styles.itemText}>
                                View Detailed Report
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Continue to Farm View exit button */}
                    <View style={styles.buttonContainer} >
                        <TouchableOpacity onPress={toggleOverlay}>
                            <Text style={styles.itemText}>
                                Continue to Farm View
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        </View>
        
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        margin: 15,
        backgroundColor: '#525252',
    },
    container: {
        alignItems: 'center', 
        borderRadius: 10,
        flex: 1,
        flexDirection: 'column',
        margin: 15,
    },
    itemText: {
        // maxWidth: '80%',
        fontSize: 20,
        // fontWeight: 'bold',
        color: '#FFF',
        alignItems: 'center'
    },
    item: {
        backgroundColor: '#6AC1DD',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    header: {
        alignItems: 'flex-end',
    },
    textHeader: {
        maxWidth: '80%',
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 30,
        borderRadius: 10,
        backgroundColor: '#6AC1DD',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
        // flex: 1
    },
    statusTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NightlySummaryOverlay;