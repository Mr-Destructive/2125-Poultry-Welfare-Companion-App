import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
} from 'react-native';
import { Button, withTheme } from 'react-native-elements';


const CustomButton = (props) => {
    return (
        <Button
            title={props.title}
            loading={false}
            loadingProps={{ size: 'medium', color: 'white' }}
            buttonStyle={{
                backgroundColor: '#6AC1DD',
                borderRadius: 5,
            }}
            titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
            containerStyle={{
                marginHorizontal: 50,
                height: 50,
                width: 200,
                marginVertical: 10}}
            onPress={()=>props.onPress()}
        />
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: 20,
        margin: 10,
        textAlign: 'center',
    },
    button: {
        // width: 150,
        // height: 50,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 5,
        // margin: 10,
    },
})

export default CustomButton;