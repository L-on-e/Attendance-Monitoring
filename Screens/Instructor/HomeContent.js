import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions, View, Dimensions, Platform, ScrollView  } from 'react-native';
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


const HomeContent = ({ userID, showMenu, scaleValue, offsetValue, closeButtonOffset, setShowMenu }) => {
    const navigation = useNavigation();
    const [recentLog, setRecentLog] = useState([]);
    const [allLog, setAllLog] = useState([]);
    const [dateToday, setDateToday] = useState([]);
    const [showAllHistory, setshowAllHistory] = useState(false);
    const scrollViewRef = useRef();
    const [scrollViewPage, setScrollViewPage] = useState(0);

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

    const handlePress = (pageIndex) => {
      scrollViewRef.current.scrollTo({
        x: pageIndex * Dimensions.get('window').width,
        animated: true,
      });
    };

    useEffect(() => {
      getDate();
      ReadRecent();
      return () => {
      }
    }, [userID, dateToday, showAllHistory])
    
    const getDate = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDateToday(formattedDate);
    }

    const ReadRecent = () =>{
      const APIURL = "http://192.168.1.34/API/ReadRecentTimeIn.php";
      const headers = {
        'Accept':'application/json',
        'Content-Type':'application.json'
      }
      let data = {
          userID: userID,
          dateToday: showAllHistory == false ? dateToday : "",
        }
       fetch(APIURL,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
      .then((response) =>
        response.json())
      .then((response) =>{
        
        if((response.map(x=> x.Data)[0]) != 'No data'){
          // response.map(x=> x.Data)[0] == "No data" ? console.log("goods"): console.log("no")
          const formattedData = response.map((record) => {
          const timeIn = `${record.TimeIn_Date} ${record.TimeIn_Time}`;
          const timeOut = `${record.TimeOut_Date} ${record.TimeOut_Time}`;
          return { ID: record.ID, TimeIn: timeIn, TimeOut: timeOut };
          });
            showAllHistory == false ? ( setRecentLog(formattedData), setAllLog([]) ): ( setAllLog(formattedData), setRecentLog([]));
        }else{
          setRecentLog([]);
        }
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

            <View style={{flexGrow: 0.1, flexDirection: 'row'}}>
              <TouchableOpacity onPress={()=>{setshowAllHistory(false),handlePress(0)}} style={{flexGrow: 1, justifyContent: 'center',
                borderTopRightRadius: 10, borderTopLeftRadius:10,
                backgroundColor: showAllHistory==true?'#fff':'#006738'}}>
                  <Text style={{textAlign: 'center'}}>Recent History</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={()=>{setshowAllHistory(true),handlePress(1)}} style={{flexGrow: 1, justifyContent: 'center',
                borderTopRightRadius: 10, borderTopLeftRadius:10,
                backgroundColor: showAllHistory==true?'#006738':'#fff'}}>
                  <Text style={{textAlign: 'center'}}>All History</Text>
              </TouchableOpacity> 
            </View>
            <View style={{flexGrow: 1}}>
              <ScrollView 
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                >
                  {recentLog.length != 0 ?
                    (<>
                      <FlatList 
                        style={styles.containerShadow}
                        data={recentLog}
                        keyExtractor={item => item.ID}
                        renderItem={({ item: data }) => (
                          <View>
                              {data.TimeOut && (
                                <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text>OUT</Text>
                                    <Text>{data.TimeOut}</Text>
                                  </View>
                                  <View style={{ borderRadius: 100, backgroundColor: 'red', height: 20, width: 20 }}/>
                                </View>
                              )}
                              {data.TimeIn && (
                                <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text>IN</Text>
                                    <Text>{data.TimeIn}</Text>
                                  </View>
                                  <View style={{ borderRadius: 100, backgroundColor: 'green', height: 20, width: 20 }}/>
                                </View>
                              )}
                          </View>
                        )}
                      />
                    </>)
                    :(<>
                      <View style={styles.containerShadow}>
                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                          <Text>No Data</Text>
                        </View>
                      </View>
                    </>)}
                    {allLog.length != 0 ? 
                    (<>
                      <FlatList 
                        style={styles.containerShadow}
                        data={allLog}
                        keyExtractor={item => item.ID}
                        renderItem={({ item: data }) => (
                          <View>
                            {data.TimeOut && (
                              <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <View style={{ flexDirection: 'column' }}>
                                  <Text>Out</Text>
                                  <Text>{data.TimeOut}</Text>
                                </View>
                                <View style={{ borderRadius: 100, backgroundColor: 'red', height: 20, width: 20 }}/>
                              </View>
                            )}
                            {data.TimeIn && (
                              <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <View style={{ flexDirection: 'column' }}>
                                  <Text>IN</Text>
                                  <Text>{data.TimeIn}</Text>
                                </View>
                                <View style={{ borderRadius: 100, backgroundColor: 'green', height: 20, width: 20 }}/>
                              </View>
                            )}
                          </View>
                        )}
                      />
                    </>)
                    :(<>
                    <View style={styles.containerShadow}>
                      <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Text>No Data</Text>
                      </View>
                    </View>
                    </>)}
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
    containerShadow: {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
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
      width: Dimensions.get('window').width - 40,
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
      marginTop: 20,
      marginBottom:10,
      alignSelf: 'center',
      borderRadius: 5,
      backgroundColor: 'white',
      width: '90%',
      height: '10%',
      flexGrow:0.2,
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
      width:"50%", 
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
