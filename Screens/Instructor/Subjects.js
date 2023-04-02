import React from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Subjects = ({ showMenu, scaleValue, offsetValue, closeButtonOffset, setShowMenu }) => {
  const styles = useStyles();
  return (
        <Animated.View style={{
          flexGrow: 1,
          backgroundColor: 'white',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 15,
          paddingVertical: 20,
          borderRadius: showMenu ? 15 : 0,
          transform: [
            { scale: scaleValue },
            { translateX: offsetValue }
          ]
        }}>
          <Animated.View style={{transform: [{ translateY: closeButtonOffset }]}}>
            <TouchableOpacity
              onPress={() => {
                Animated.timing(scaleValue, {
                  toValue: showMenu ? 1 : 0.88,
                  duration: 300,
                  useNativeDriver: true
                }).start();
    
                Animated.timing(offsetValue, {
                  toValue: showMenu ? 0 : 230,
                  duration: 300,
                  useNativeDriver: true
                }).start();
    
                Animated.timing(closeButtonOffset, {
                  toValue: !showMenu ? -30 : 0,
                  duration: 300,
                  useNativeDriver: true
                }).start();
    
                setShowMenu(!showMenu);
              }}
            >
              <AntDesign name={showMenu ? 'menu-unfold' : 'menu-fold'} size={20} style={{ marginTop: 40 }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black', paddingTop: 20 }}>Subjects</Text>    
            <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 15, paddingBottom: 5 }}>sub</Text>
            <Text>sub</Text>
          </Animated.View>
        </Animated.View>
      );
    };


export default Subjects
const useStyles = () => {
  const { width, height } = useWindowDimensions(); 
  return styles = StyleSheet.create({
    
  });
}