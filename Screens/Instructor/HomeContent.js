import React from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions  } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeContent = ({ showMenu, scaleValue, offsetValue, closeButtonOffset, setShowMenu }) => {
    const styles = useStyles();
    const navigation = useNavigation();
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
          <Animated.View style={{ transform: [{ translateY: closeButtonOffset }] }}>
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
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black', paddingTop: 20 }}>Home</Text> 
            <TouchableOpacity onPress={()=>navigation.navigate('TimeIn')}>
                <Text>Time In</Text>
            </TouchableOpacity>   
            <TouchableOpacity onPress={()=>navigation.navigate('TimeOut')}>
                <Text>Time Out</Text>
            </TouchableOpacity>   
          </Animated.View>
        </Animated.View>
      );
    };

export default HomeContent

const useStyles = () => {
    const { width, height } = useWindowDimensions(); 
    return styles = StyleSheet.create({
        
    });
  }