import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions, View, Dimensions, Platform, ScrollView, Alert  } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'
import { Ionicons } from "@expo/vector-icons"
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
    
    if (!isReady || !fontsLoaded) { 
      return(
        <Animated.View style={[styles.contentContainer,{ borderRadius: showMenu ? 15 : 0, transform: [ { scale: scaleValue }, { translateX: offsetValue } ] }]}>
          <Animated.View style={{ transform: [{ translateY: closeButtonOffset }] }}>
          </Animated.View>
        </Animated.View>
      ) }
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
                <AntDesign name={showMenu ? 'menu-unfold' : 'menu-fold'} size={25} color={'#006738'}/>
                <Text style={styles.titHome}>Home</Text> 
            </TouchableOpacity>

            <View style={styles.timeInOut}>

              <Text className="text-xl" style={styles.qrTit}>SCAN QR</Text>

              <View style={styles.tioBtnCtn} className="flex-row">
                <Image source={require('../Instructor/scan.png')}  style={styles.scanImg}/>

                <View style={styles.tIOcontainer} className="flex-column">

                  <TouchableOpacity onPress={()=>navigation.navigate('TimeIn')} className="w-full"> 
                    <View className="flex-row border-0 bg-[#E6E6E6]" style={styles.btnctn}>
                        <Text style={styles.tioTEXTbtn} className="text-lg">Time In</Text>
                        <Ionicons name="time-outline"  color='white' size={30}  style={styles.btnIcon}/>
                    </View>
                  </TouchableOpacity>   


                  <TouchableOpacity onPress={()=>navigation.navigate('TimeOut')} className="w-full"> 
                    <View className="flex-row border-0 bg-[#E6E6E6]" style={styles.btnctn}>
                        <Text style={styles.tioTEXTbtn} className="text-lg">Time Out</Text>
                        <Ionicons name="log-out-outline"  color='white' size={30}  style={styles.btnIcon}/>
                    </View>
                  </TouchableOpacity>   
                </View>

              </View>

            </View>


            <View style={{flexGrow: 0.1, flexDirection: 'row', marginTop:15, marginHorizontal:4}}>
              <TouchableOpacity onPress={()=>{handlePress(0, false)}} style={{flexGrow: 1, justifyContent: 'center',
                borderTopRightRadius: 10, borderTopLeftRadius:10,
                backgroundColor: showAllHistory==true?'#fff':'#006738',minHeight:'5%', maxHeight:'100%'}}>
                  <Text style={{textAlign: 'center', fontFamily:'Poppins_600SemiBold', color:showAllHistory==true?'#006738':'white'}}>Recent History</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={()=>{handlePress(1,true)}} style={{flexGrow: 1, justifyContent: 'center',
                borderTopRightRadius: 10, borderTopLeftRadius:10,
                backgroundColor: showAllHistory==true?'#006738':'#fff', minHeight:'5%', maxHeight:'100%' }}>
                  <Text style={{textAlign: 'center' , fontFamily:'Poppins_600SemiBold', color:showAllHistory==true?'white':'#006738'}}>All History</Text>

              </TouchableOpacity> 
            </View>
            <View style={{flexGrow: 1, marginTop: -15}}>
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
                  <RecentHistory/>
                  <AllHistory/>
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
      backgroundColor: '#fff',
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

  underline:{
    backgroundColor: 'red'
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
      marginTop: 20,
      marginBottom:10,
      alignSelf: 'center',
      borderRadius: 5,
      backgroundColor: 'white',
      width: '90%',
      maxHeight: '20%',
      minHeight:'20%',
      flexGrow:0.4,
      alignItems:'center',
      justifyContent: 'center',
      justifyContent:'space-evenly',
      shadowColor: "#000",
      shadowOffset:{
          width:0,
          height:1,
      },
      shadowOpacity:0.2,
      shadowRadius:1.41,
      elevation:2,
    },

    tioBtnCtn:{
      marginTop: -10
    },

    qrTit:{
      fontFamily:'Poppins_800ExtraBold',
      color: '#006738',
    },

    scanImg:{
      aspectRatio: 1,
      resizeMode: 'contain',
      maxWidth: "30%",
      maxHeight: "80%",
      alignSelf: 'center',
    },

    btnctn:{
      borderRadius:5,
      alignItems: 'center',
      marginVertical: 10
    },

    tIOcontainer:{
      justifyContent:'center',
      flexGrow: 0.1,
      width:"40%", 
      marginVertical: 10,
      marginLeft:10
    },
    btnIcon:{
      backgroundColor: '#006738',
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    tioTEXTbtn:{
      fontFamily:'Poppins_600SemiBold',
      color:'#006738',
      flexGrow: 1,
      marginLeft: 10
    },

    //

  })
