import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, ImageBackground, StatusBar, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackActions, useRoute } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'
import { LinearGradient } from 'expo-linear-gradient';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

const LoginScreen = () => {
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

  const navigation = useNavigation();
  const [ID, setID] = useState(null);
  const [password, setPassword] = useState(null);

  const login = () =>{
    const APIURL = "http://192.168.1.17/API/Login.php";
    const headers = {
      'Accept':'application/json',
      'Content-Type':'application.json'
    }
    let data = {
      id: ID,
      password: password,
    }
    fetch(APIURL,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
    .then((response) =>
      response.json())
    .then((response) =>{
      console.log(response[0].essage);
      response[0].Message == "Success" ? 
        navigation.dispatch(StackActions.replace('Home')) :  Alert.alert(response[0].Message);  
    })
    .catch((error)=>console.log(error));
  }

  if (!isReady || !fontsLoaded) { return null;}
  return (
    <KeyboardAvoidingView style={styles.container}>


        <Image source={require('../images/lormaLogo.png')} style={styles.lolma}/>

      <LinearGradient
        // Background Linear Gradient
        start={{ x: 1, y: -.9 }}
        end={{ x: 1, y: .9 }}
        colors={['#fff','transparent', '#006738']}
        style={styles.background}
      >

      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

  container:{
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex:1,
    backgroundColor:"#fff"
  },
  background:{
    flex:1
  },
  lolma:{
    aspectRatio: 1,
    resizeMode: 'contain',
    maxWidth: "50%",
    maxHeight: "50%",
    alignSelf:'center'
  },
  sText:{
    fontFamily: 'Poppins_500Medium',
  },

  borderColor:{
    borderColor: "#006738"
  },
  
  inputTxt:{
    fontFamily: 'Poppins_600SemiBold',
  },
  btnText:{
    fontFamily: 'Poppins_600SemiBold',
  },
  btnText1:{
    fontFamily: 'Poppins_500Medium',
    color: "#006738",
    marginLeft: 5
  }

})