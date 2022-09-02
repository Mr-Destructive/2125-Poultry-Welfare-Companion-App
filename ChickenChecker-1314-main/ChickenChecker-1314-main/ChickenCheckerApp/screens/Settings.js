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

export default function Settings({navigation, route}) {

    console.log(route.params);

    const list_data = [    
        {
            key: 1,
            title: 'User Preferences',
            icon: 'edit',
            route: 'UserPreferences'
        },
        {
            key: 2,
            title: 'Password',
            icon: 'fingerprint',
            route: 'Password'
        },
        {
            key: 3,
            title: 'Privacy',
            icon: 'lock',
            route: 'Privacy'
        },
    ];

    const log = () => console.log('Button Pressed');

    return (
        <View>
            {list_data.map((item) => (
                <ListItem.Swipeable
                    key={item.key}
                    onPress={() => navigation.navigate(item.route, {user: route.params})}
                    bottomDivider
                >
                    <Icon name={item.icon} />
                    <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            ))}
        </View>
      
    );
};