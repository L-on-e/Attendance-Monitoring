import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Instructor/Home';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen.js'
import QRScanner from './Screens/Instructor/QRScanner';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}}  />
          <Stack.Screen name="QRScanner" component={QRScanner} options={{headerShown: false}}  />
        </Stack.Group>
      </Stack.Navigator>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})