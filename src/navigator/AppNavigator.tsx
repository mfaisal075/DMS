import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Users from '../screens/Users';
import Donations from '../screens/Donations';
import Configurations from '../screens/Configurations';
import UpdateDonation from '../screens/UpdateDonation';
import Reports from '../screens/Reports';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Users"
          component={Users}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Donations"
          component={Donations}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Configurations"
          component={Configurations}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UpdateDonation"
          component={UpdateDonation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Reports"
          component={Reports}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
