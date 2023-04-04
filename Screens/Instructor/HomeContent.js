import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Animated, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions, View, Dimensions, Platform  } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const HomeContent = ({ userID, showMenu, scaleValue, offsetValue, closeButtonOffset, setShowMenu }) => {
    const styles = useStyles();
    const navigation = useNavigation();
    const [recentLog, setRecentLog] = useState([]);
    const [dateToday, setDateToday] = useState([]);

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
      },
    });
  }