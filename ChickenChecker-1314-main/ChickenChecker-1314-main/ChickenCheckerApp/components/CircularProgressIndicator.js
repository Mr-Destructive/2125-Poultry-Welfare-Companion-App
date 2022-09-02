import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function CircularProgressIndicator(props) {

    // PARAMS
    // props.title -> Title of the status indicator
    // props.fill -> Value of the progress
    // props.color -> The color of the progress bar
    // props.value -> The text inside the indicator

    return(
        <View style={styles.progressContainer}>
            <Text style={styles.text}>
                {props.title}
            </Text>
            <AnimatedCircularProgress
                size={60}
                width={10}
                fill={props.fill}
                rotation={0}
                duration={1500}
                tintColor={props.color}
                // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor={'#C4C4C4'}
            >
                {
                    (fill) => (
                    <Text>
                        { props.value }
                    </Text>
                    )
                }
            </AnimatedCircularProgress>
        </View>
    );
}

const styles = StyleSheet.create({
    progressContainer: {
        alignItems: 'center',
        paddingHorizontal: 20
    },
    text: {
        paddingBottom: 5,
        fontSize: 12,
        textTransform: 'uppercase'
    },
});