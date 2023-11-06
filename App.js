
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

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
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
