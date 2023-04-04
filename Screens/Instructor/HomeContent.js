import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions, View, Dimensions, Platform  } from 'react-native';
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


const HomeContent = ({ userID, showMenu, scaleValue, offsetValue, closeButtonOffset, setShowMenu }) => {
    const navigation = useNavigation();
    const [recentLog, setRecentLog] = useState([]);
    const [dateToday, setDateToday] = useState([]);


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

    useEffect(() => {
      ReadRecent();
      getDate();
      return () => {
      }
    }, [userID, dateToday])
    
    const getDate = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDateToday(formattedDate);
    }

    const ReadRecent = () =>{
      const APIURL = "http://192.168.111.95/API/ReadRecentTimeIn.php";
      const headers = {
        'Accept':'application/json',
        'Content-Type':'application.json'
      }
      let data = {
          userID: userID ,
          dateToday: dateToday,
        }
       fetch(APIURL,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
      .then((response) =>
        response.json())
      .then((response) =>{
        setRecentLog(response);
        // .flatMap((inner)=>setRecentLog(inner))
      })
      .catch((error)=>console.log(error));
    }
    
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
                <AntDesign name={showMenu ? 'menu-unfold' : 'menu-fold'} size={25} color="#006738"/>
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
            <View style={{flexGrow: 0.1, backgroundColor: '#006738', flexDirection: 'row', justifyContent: 'space-evenly', alignItems:'center'}}>
              <TouchableOpacity style={{padding:10, backgroundColor: 'white'}}>
                  <Text>Recent History</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={{padding:10, backgroundColor: 'white'}}>
                  <Text>All History</Text>
              </TouchableOpacity> 
            </View>
            <View style={{flexGrow: 1, backgroundColor: 'powderblue'}}>
              <View>
                <FlatList 
                  style={styles.containerShadow}
                  data={recentLog}
                  keyExtractor={item => item.ID}
                  renderItem={({ item: data }) => (
                    <View style={{ padding: 5 }}>
                      <Text>Date: {data.TimeIn_Date}</Text>
                      <Text>Time: {data.TimeIn_Time}</Text>
                    </View>
                  )}
                />
              </View>            
            </View>
          </Animated.View>
        </Animated.View>
      );
    };

export default HomeContent


  const styles = StyleSheet.create({
    //CONTAINER
    contentContainer: {
      flexGrow: 1,
      backgroundColor: 'white',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 15,
    },

    containerShadow: {
      padding: 15,
      backgroundColor: "white",
      marginHorizontal: 4,
      marginVertical: 15,
      shadowColor: "#000",
      shadowOffset:{
          width:0,
          height:1,
      },
      shadowOpacity:0.2,
      shadowRadius:1.41,
      elevation:2,
    },
    //

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