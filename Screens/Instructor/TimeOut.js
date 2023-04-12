import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import { UserContext } from '../../hooks/useAuth';

import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

const TimeOut = () => {
  const { user } = useContext(UserContext);
    const navigation = useNavigation();
    const [hasPermission, setHasPermission]= useState();
    const [scanned, setScanned] = useState();


    
    const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
    return () => {
      SplashScreen.hideAsync();
    };
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
      const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
  
      getBarCodeScannerPermissions();
    }, []);
  
    const handleBarCodeScanned = async({ type, data }) => {
      setScanned(true);
      const  timeOut = await SetTimeOut();
      await InsertDB(timeOut.date, timeOut.time, data);
      Alert.alert("Time out","Date: "+ timeOut.date +"\nTime: " + timeOut.time);
    };
  
    const InsertDB = (date, time, uid) =>{
      const APIURL = "http://192.168.111.95/API/TimeOut.php";
      const headers = {
        'Accept':'application/json',
        'Content-Type':'application.json'
      }
      let data = {
          ID: uid ,
          roomID: uid,
          instructorID: user.id,
          timeOutDate: date,
          timeOutTime: time,
        }
        console.log(data);  
      fetch(APIURL,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
      .then((response) =>
        response.json())
      .then((response) =>{
        response[0].message == "Success" ? 
          console.log("Success")  
          :  console.log(response[0].message);  
      })
      .catch((error)=>console.log(error));
    }
  
    const SetTimeOut = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();
      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      return { date: formattedDate, time: formattedTime };
    }
  
    if (hasPermission === null) {
      Alert.alert("Requesting for camera permission");
    }
    if (hasPermission === false) {
      Alert.alert("No access to camera");
    }
  if (!isReady || !fontsLoaded) {
    return null;
  }
    return (
      <SafeAreaView className="flex-1">
          <View>
            <View className="pt-16 pb-5 pl-6 bg-[#006738] flex-row items-center">
              <TouchableOpacity onPress={()=>{navigation.navigate('Home')}}>
                  <Ionicons name='chevron-back-outline' color={"#fff"} size={30}/>
              </TouchableOpacity>
              <Text className="text-white text-2xl"  style={styles.headTit}>Time Out</Text>
            </View>
          </View>
          <View className="grow">
              <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  className="flex-1 border-2 m-3"
              />
          </View>
          <View className="flex-none">
              {
                  scanned &&
                  <TouchableOpacity onPress={() =>{setScanned(false)}} className="border-2 p-5 rounded-[10px] bg-[#006738] items-center justify-center">
                  <Text className="text-white text-3xl">Scan Again</Text>
                  </TouchableOpacity>
              }
          </View>
      </SafeAreaView>
    )
  }

export default TimeOut

const styles = StyleSheet.create({

    headTit:{
    fontFamily: 'Poppins_600SemiBold',
  },
})