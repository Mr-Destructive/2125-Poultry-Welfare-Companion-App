import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import Settings from './screens/Settings';
import FarmView from './screens/FarmView';
import HouseView from './screens/HouseView';
import ComplexView from './screens/ComplexView';
import ComplexManagement from './screens/ComplexManagement';
import UserPreferences from './screens/settings_screens/UserPreferences';
import Password from './screens/settings_screens/Password';
import Privacy from './screens/settings_screens/Privacy';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Stack = createNativeStackNavigator();

export default function App() {
  global.baseURL = 'http://localhost:8000/';
  // global.baseURL = 'http://192.168.137.1:8000/';
  global.colorLookup = {
    0 : '#333333',
    1 : '#54DB59',
    2 : '#0B6214',
    3 : '#FAE702',
    4 : '#F18F02',
    5 : '#C60A06'
  };
  return (  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Farm View" component={FarmView} />
        <Stack.Screen name="House View" component={HouseView} />
        <Stack.Screen name="Complex View" component={ComplexView} />
        <Stack.Screen name="Complex Management" component={ComplexManagement} />
        <Stack.Screen name="UserPreferences" component={UserPreferences} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="Privacy" component={Privacy} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
