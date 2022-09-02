import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import {
  Text,
  ListItem,
  Avatar,
  Icon,
  Badge,
  ListItemProps,
  Button,
  Switch,
  colors
} from 'react-native-elements';

export default function Privacy({navigation}) {

    return (
        <View>
            <Text style={styles.text}>Privacy Statement</Text>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus sed viverra tellus. Viverra mauris in aliquam sem fringilla. Scelerisque mauris pellentesque pulvinar pellentesque. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus. Feugiat in fermentum posuere urna nec tincidunt praesent. Facilisi cras fermentum odio eu feugiat pretium nibh. Ut porttitor leo a diam sollicitudin tempor. Tempus quam pellentesque nec nam aliquam sem et. Ipsum faucibus vitae aliquet nec. Eu facilisis sed odio morbi quis commodo.
                {'\n'}{'\n'}
                Mattis nunc sed blandit libero volutpat sed. Hac habitasse platea dictumst quisque sagittis purus sit. Egestas purus viverra accumsan in nisl nisi. Mauris ultrices eros in cursus turpis. Sed velit dignissim sodales ut eu. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Nam at lectus urna duis convallis convallis. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis. Nulla pharetra diam sit amet. Etiam sit amet nisl purus in mollis nunc sed. Odio euismod lacinia at quis risus sed vulputate odio ut. Ultrices gravida dictum fusce ut placerat orci. A condimentum vitae sapien pellentesque habitant morbi tristique.
                {'\n'}{'\n'}
                Massa sed elementum tempus egestas sed sed risus pretium. Odio eu feugiat pretium nibh ipsum consequat. Dignissim diam quis enim lobortis scelerisque fermentum dui. Laoreet sit amet cursus sit amet dictum. Morbi non arcu risus quis varius quam. Semper quis lectus nulla at volutpat diam ut. Arcu dui vivamus arcu felis bibendum. Gravida quis blandit turpis cursus in hac. In aliquam sem fringilla ut morbi. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Tellus orci ac auctor augue. Vel quam elementum pulvinar etiam non quam lacus suspendisse. Ultrices eros in cursus turpis massa. Id semper risus in hendrerit gravida rutrum.
            </Text>
        </View>
      
    );
};

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    //   flex: 1,
      flexDirection: 'column',
    },
    text: {
      color: '#D3D3D3',
      fontSize: 64,
      marginBottom: 30
    },

});