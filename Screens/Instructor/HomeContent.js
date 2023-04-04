import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions, View, Dimensions, Platform, ScrollView  } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const HomeContent = ({ userID, showMenu, scaleValue, offsetValue, closeButtonOffset, setShowMenu }) => {
    const styles = useStyles();
    const navigation = useNavigation();
    const [recentLog, setRecentLog] = useState([]);
    const [allLog, setAllLog] = useState([]);
    const [dateToday, setDateToday] = useState([]);
    const [showAllHistory, setshowAllHistory] = useState(false);
    const scrollViewRef = useRef();

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
      const APIURL = "http://192.168.111.95/API/ReadRecentTimeIn.php";
      const headers = {
        'Accept':'application/json',
        'Content-Type':'application.json'
      }
      let data = {
          userID: userID ,
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
        const formattedData = response.map((record) => {
          const timeIn = `${record.TimeIn_Date} ${record.TimeIn_Time}`;
          const timeOut = `${record.TimeOut_Date} ${record.TimeOut_Time}`;
          return { ID: record.ID, TimeIn: timeIn, TimeOut: timeOut };
        });
        showAllHistory == false ?( setRecentLog(formattedData), setAllLog([]) ):( setAllLog(formattedData), setRecentLog([]));
      })
      .catch((error)=>console.log(error));
    }
    
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
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black', paddingLeft: 15}}>Home</Text> 
            </TouchableOpacity>
            <View style={{flexGrow:0.05}}>
              <TouchableOpacity onPress={()=>navigation.navigate('TimeIn')}>
                  <Text>Time In</Text>
              </TouchableOpacity>   
              <TouchableOpacity onPress={()=>navigation.navigate('TimeOut')}>
                  <Text>Time Out</Text>
              </TouchableOpacity>   
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
                contentContainerStyle={styles.carouselContentContainer}>
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
              </ScrollView>            
            </View>
          </Animated.View>
        </Animated.View>
      );
    };

export default HomeContent

const useStyles = () => {
    const { width, height } = useWindowDimensions(); 
    return styles = StyleSheet.create({
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
          width: Dimensions.get('window').width - 40,
      },
      carouselContentContainer: {
        flexGrow: 1,
        overflow: 'hidden',
      },
    });
  }