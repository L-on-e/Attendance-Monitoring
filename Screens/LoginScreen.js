import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, ImageBackground, StatusBar, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackActions, useRoute } from '@react-navigation/native';
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
    const APIURL = "http://192.168.111.95/API/Login.php";
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
    <ImageBackground className="absolute inset-x-0 top-0 " source={require('../images/loginBG.png')} style={styles.bgImage}>
    
    <View className="flex-column" style={styles.container}>
      <View className="items-center my-32">
        <Text style={styles.logInWc} className="self-end -left-10" >WELCOME</Text>
          <TouchableOpacity>
            <Image className="my-24" source={require('../images/gBtn.png')} style={styles.gbtn}/>
          </TouchableOpacity>
          <View>
            <Text style={styles.sText} className="-my-44">Or</Text>
          </View>

          <View className="border-2 w-2/4 p-1 h-10 rounded-[8px] -my-32" style={styles.borderColor}>
              <TextInput className="text-[18px] text-center" value={ID} onChangeText={text => setID(text)} placeholder="ENTER ID"  placeholderTextColor="#006738" style={styles.inputTxt}/>
          </View>
          <View className="border-2 w-1/2 h-10 p-1 rounded-[8px] my-36" style={styles.borderColor}>
              <TextInput className="w-full text-[18px] text-center" value={password} onChangeText={text => setPassword(text)} placeholder="PASSWORD" secureTextEntry placeholderTextColor="#006738" style={styles.inputTxt}/>
          </View>

          <TouchableOpacity onPress={
            () => navigation.navigate("Home")
            // login
            } className="border-2 p-2 w-4/12 h-10 rounded-[10px] items-center bg-[#006738] border-transparent -my-32">
              <Text className="text-white text-[18px]" style={styles.btnText}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-centerborder-transparent my-40">
              <Text className="text-white text-[16px]" style={styles.btnText1}>Forgot Password?</Text>
          </TouchableOpacity>

          <View className="flex-row  -top-36 ">
            <Text className="text-[16px] text-black">Need an Account?</Text>  
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="items-center ">
                <Text className="text-[16px]" style={styles.btnText1}>Sign Up</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

  container:{
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex:1,
  },

  bgImage:{
    width: "100%",
    hieght: "100%",
  },

  logInWc:{
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    fontSize: 55
  },

  gbtn:{
    width: "60%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain'
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