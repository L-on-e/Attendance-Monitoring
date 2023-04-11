import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import UserContextProvider from './hooks/useAuth';

export default function App() {
  return (
    <NavigationContainer>
      <UserContextProvider> 
        <StackNavigator/>
      </UserContextProvider>
    </NavigationContainer>
  );
}

