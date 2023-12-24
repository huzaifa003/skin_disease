
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Home from './Screens/Home';
import PostData from './Screens/PostData';
import CameraScreen from './Screens/CameraScreen';
import BookAppointment from './Screens/BookAppointment';
import ShowAppointments from './Screens/ShowAppointments';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ShowDetails from './Screens/ShowDetails';

export default function App() {

  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const TabNavigator = () => {
    return (
      <Tab.Navigator>
        {/* <Tab.Screen name="Home" component={Home} /> */}

        <Tab.Screen name="ShowAppointments" component={ShowAppointments} />
      </Tab.Navigator>
    )
  }

  const stackNavigator = () => {
    return (
      <Stack.Navigator>

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Sign Up Page" }}
        />

        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ title: "Sign In Page" }}
        />

        <Stack.Screen
          name='ShowAppointments'
          component={ShowAppointments}
          options={{ title: 'Show Appointments' }}
        />


        <Stack.Screen
          name="BookAppointment"
          component={BookAppointment}
          options={{ title: "Book Appointment Page" }}
        />

        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ title: "Camera Page" }}
        />


        <Stack.Screen 
          name='ShowDetails'
          component={ShowDetails}
          options={{title: 'Show Details'}}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home-Page" }}
        />

        <Stack.Screen
          name="PostData"
          component={PostData}
          options={{ title: "Add Data" }}
        />




      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      {stackNavigator()}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
