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
    <KeyboardAvoidingView style={styles.container}
    >
      <ImageBackground source={require('../images/CLI_BDG.png')} style={styles.cliBg}>
          <Image source={require('../images/lormaLogo.png')} style={styles.lolma}/>
      <LinearGradient
        // Background Linear Gradient
        start={{ x: 1, y: -.9}}
        end={{ x: 1, y: .9}}
        colors={['#fff','transparent','#006738']}
        style={styles.background}
      >
          <View style={styles.inputFields} className={'flex-column'}>
            <View  className="border-b-4 w-1/2  p-1 "style={styles.borderColor}>
                <TextInput className="text-[18px] text-center" value={ID} onChangeText={text => setID(text)} placeholder="ENTER ID"  placeholderTextColor="#006738" style={styles.inputTxt}/>
            </View>
            <View className="border-b-4 w-1/2  p-1" style={styles.borderColor}>
                <TextInput className="w-full text-[18px] text-center" value={password} onChangeText={text => setPassword(text)} placeholder="PASSWORD" secureTextEntry placeholderTextColor="#006738" style={styles.inputTxt}/>
            </View>
          </View>

      </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

  container:{
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex:1,
    backgroundColor:"#006738",
  },
  background:{
    flex:1
  },
  cliBg:{
    aspectRatio: 1,
    resizeMode: 'cover',
    maxWidth: "100%",
    maxHeight: "100%",
    alignSelf:"flex-start",
    marginTop:-50
  },
  lolma:{
    aspectRatio: 1,
    resizeMode: 'contain',
    maxWidth: "50%",
    minHeight: "50%",
    alignSelf:"flex-end",
    backgroundColor: 'blue',
  },

  inputFields:{
   alignItems: "flex-end",
   flexGrow: .1,
   justifyContent: 'space-evenly',
   backgroundColor:'red'
  },
  sText:{
    fontFamily: 'Poppins_500Medium',
  },

  borderColor:{
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20
  },
  
  inputTxt:{
    fontFamily: 'Poppins_600SemiBold',
    padding:5,
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