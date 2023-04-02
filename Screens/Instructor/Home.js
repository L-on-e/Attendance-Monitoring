import { Alert, Animated, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Navbar from '../components/Navbar';
import HomeContent from './HomeContent';
import SettingsContent from './SettingsContent';
import Subjects from './Subjects';

const Home = () => {
  const styles = useStyles();
  const [showMenu, setShowMenu] = useState(false);

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

  const [activeNavigation, setActiveNavigation] = useState('Home');
  const handleActiveNavigation = (value) => {
    setActiveNavigation(value);
  }
  const handleMenuBoolean = (showMenu) =>{
    setShowMenu(showMenu);
  }
  return (
    <SafeAreaView style={styles.container}>
      <Navbar handleActiveNavigation={handleActiveNavigation}/>
      {
        activeNavigation == 'Home' ?
        <HomeContent showMenu={showMenu} scaleValue={scaleValue} offsetValue={offsetValue} closeButtonOffset={closeButtonOffset} setShowMenu={handleMenuBoolean}/>
        :
        activeNavigation == 'Subjects' ?
        <Subjects showMenu={showMenu} scaleValue={scaleValue} offsetValue={offsetValue} closeButtonOffset={closeButtonOffset} setShowMenu={handleMenuBoolean}/>
        :
        <SettingsContent showMenu={showMenu} scaleValue={scaleValue} offsetValue={offsetValue} closeButtonOffset={closeButtonOffset} setShowMenu={handleMenuBoolean}/>
      }
      {/* {stateFromChild == 'Home' ? <HomeContent/>: stateFromChild == "Subjects"? <SubjectsContent/>:<SettingsContent/>} */}
    </SafeAreaView>
  );
}

export default Home

const useStyles = () => {
  const { width, height } = useWindowDimensions(); 
  return styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#006738',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  });
}