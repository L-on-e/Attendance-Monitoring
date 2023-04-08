import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions, View, Dimensions, Platform, ScrollView, Alert  } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { UserContext } from '../../hooks/useAuth';
import RecentHistory from '../components/RecentHistory';
import AllHistory from '../components/AllHistory';


const HomeContent = ({ showMenu, scaleValue, offsetValue, closeButtonOffset, setShowMenu }) => {
    const { user } = useContext(UserContext);
    const navigation = useNavigation();
    const [showAllHistory, setshowAllHistory] = useState(false);
    const scrollViewRef = useRef();

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      async function prepare() {
        try { await SplashScreen.preventAutoHideAsync();} 
        catch (e) {console.warn(e);} 
        finally { setIsReady(true);}
      }
      prepare();
      return () => { SplashScreen.hideAsync(); };
    }, [isReady]);
    
    let [fontsLoaded] = useFonts({
      Poppins_400Regular,
      Poppins_500Medium,
      Poppins_600SemiBold,
      Poppins_700Bold,
      Poppins_800ExtraBold,
      Poppins_900Black,
    });

    const handlePress = (pageIndex, isShowAllHistory) => {
      setshowAllHistory(isShowAllHistory);
      scrollViewRef.current.scrollTo({
        x: pageIndex * Dimensions.get('window').width,
        animated: true,
      });
    };
    console.log(showAllHistory);
    
    if (!isReady || !fontsLoaded) { return null;}
    return (
        <Animated.View style={[styles.contentContainer,{ borderRadius: showMenu ? 15 : 0, transform: [{ scale: scaleValue }, { translateX: offsetValue }] }]}>
          <Animated.View style={{ transform: [{ translateY: closeButtonOffset }], flexGrow: 1 }}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 40 }}
              onPress={() => {
                Animated.timing(scaleValue, { toValue: showMenu ? 1 : 0.88, duration: 300, useNativeDriver: true }).start();
                Animated.timing(offsetValue, { toValue: showMenu ? 0 : 230, duration: 300, useNativeDriver: true }).start();
                Animated.timing(closeButtonOffset, { toValue: !showMenu ? -10 : 0, duration: 300, useNativeDriver: true }).start();
                setShowMenu(!showMenu);
              }}>
                <AntDesign name={showMenu ? 'menu-unfold' : 'menu-fold'} size={25}/>
                <Text style={styles.titHome}>Home</Text> 
            </TouchableOpacity>
            <View style={styles.timeInOut}>

              <View style={styles.tIOcontainer}>
                <Text className="text-lg" style={styles.tioTEXT}>Click Here to </Text>
                <TouchableOpacity onPress={()=>navigation.navigate('TimeIn')}>
                    <Text style={styles.tioTEXTbtn} className="text-lg">Time In</Text>
                </TouchableOpacity>   
              </View>
              
              <View style={styles.tIOcontainer}>
                <Text  className="text-lg" style={styles.tioTEXT}>Click Here to </Text>
                <TouchableOpacity onPress={()=>navigation.navigate('TimeOut')}>
                    <Text style={styles.tioTEXTbtn} className="text-lg ">Time Out</Text>
                </TouchableOpacity>
              </View>

            </View>
            <View style={{flexGrow: 0.1, flexDirection: 'row'}}>
              <TouchableOpacity onPress={()=>{handlePress(0, false)}} style={{flexGrow: 1, justifyContent: 'center',
                borderTopRightRadius: 10, borderTopLeftRadius:10,
                backgroundColor: !showAllHistory ? '#006738' : '#fff'}}>
                <Text style={{textAlign: 'center'}}>Recent History</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={()=>{handlePress(1,true)}} style={{flexGrow: 1, justifyContent: 'center',
                borderTopRightRadius: 10, borderTopLeftRadius:10,
                backgroundColor: showAllHistory ? '#006738' : '#fff'}}>
                <Text style={{textAlign: 'center'}}>All History</Text>
              </TouchableOpacity> 
            </View>
            <View style={{flexGrow: 1}}>
              <ScrollView 
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const x = event.nativeEvent.contentOffset.x;
                  const currentPage = x >= Dimensions.get('window').width / 2 ? 1 : 0;
                  setshowAllHistory(currentPage === 1);
                }}>
                  <RecentHistory />
                  <AllHistory />
              </ScrollView>            
            </View>
          </Animated.View>
        </Animated.View>
      );
    };

export default HomeContent
  
  const styles = StyleSheet.create({
    contentContainer: {
      flexGrow: 1,
      backgroundColor: 'white',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
  carouselContentContainer: {
    flexGrow: 1,
    overflow: 'hidden',
  },
    
    //HOME TITLE
    titHome:{
      fontSize: 30, 
      color: '#006738', 
      paddingLeft: 15, 
      fontFamily:'Poppins_700Bold'
    },
    //

    //TIME IN TIME OUT BUTTON
    timeInOut:{
      flexGrow:0.1,
      alignItems:'center',
      justifyContent: 'center',
      justifyContent:'space-evenly'
    },

    tIOcontainer:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
    },

    tioTEXT:{
      fontFamily:'Poppins_500Medium'
    },

    tioTEXTbtn:{
      fontFamily:'Poppins_600SemiBold',
      color:'#006738'
    },
    //

  })
