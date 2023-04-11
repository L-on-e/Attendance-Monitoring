import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Instructor/Home';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen.js'
import TimeIn from './Screens/Instructor/TimeIn';
import TimeOut from './Screens/Instructor/TimeOut';
import { UserContext } from './hooks/useAuth';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useContext(UserContext);
  return (
      <Stack.Navigator>
        { user && (user.isVerified == 1) ? 
          (<>
            <Stack.Group>
              <Stack.Screen name="Home" component={Home} options={{headerShown: false}}  />
              <Stack.Screen name="TimeIn" component={TimeIn} options={{headerShown: false}}  />
              <Stack.Screen name="TimeOut" component={TimeOut} options={{headerShown: false}}  />
            </Stack.Group>
          </>)
          :(<>
            <Stack.Group>
              <Stack.Screen name="SignIn" component={LoginScreen} options={{headerShown: false}}/>
              <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
            </Stack.Group>
          </>)}
      </Stack.Navigator>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})