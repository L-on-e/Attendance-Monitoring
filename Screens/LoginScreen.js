import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, ImageBackground, StatusBar, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackActions, useRoute } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../hooks/useAuth';
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
  const { login } = useContext(UserContext);
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


  const handleLogin = () =>{
    login(ID, password);
  }

  if (!isReady || !fontsLoaded) { return null;}
  return (
    <KeyboardAvoidingView style={styles.container}
    >
      <ImageBackground source={require('../images/CLI_BDG.png')} style={styles.cliBg}>
          {/* <Image source={require('../images/lormaLogo.png')} style={styles.lolma}/> */}
      <LinearGradient
        // Background Linear Gradient
        start={{ x: 1, y: -.9}}
        end={{ x: 1, y: .9}}
        colors={['#fff','transparent','#fff']}
        style={styles.background}
      >
          <View className="flex-column" style={styles.content}>
            <Image source={require('../images/lormaLogo.png')}  style={styles.lolma}/>
            <View style={styles.inputFields} className={'flex-column'}>
              <View  className="border-b-4 w-1/2  p-1 "style={styles.borderStyle}>
                  <TextInput className="text-[18px] text-center " value={ID} onChangeText={text => setID(text)} placeholder="ENTER ID"  placeholderTextColor="#006738" style={styles.inputTxt}/>
              </View>
              <View className="border-b-4 w-1/2  p-1" style={styles.borderStyle}>
                  <TextInput className="text-[18px] text-center" value={password} onChangeText={text => setPassword(text)} placeholder="PASSWORD" secureTextEntry placeholderTextColor="#006738" style={styles.inputTxt}/>
              </View>
            </View>
          </View>

          <View className="w-full" style={styles.btnDvd}>
              <TouchableOpacity onPress={
                handleLogin
                } className="border-4 p-1 w-1/2 h-10 rounded-[20px] items-center bg-[#006738]" style={styles.btnDes}>
                  <Text className="text-white text-[18px]" style={styles.btnText}>SIGN IN</Text>
              </TouchableOpacity>
          </View>
          <View className="flex-column" style={styles.etcBtn}>
            <TouchableOpacity className="border-transparent ">
                <Text className="text-white text-[16px]" style={styles.btnText1}>Forgot Password?</Text>
            </TouchableOpacity>

            <View className="flex-row ">
              <Text className="text-[16px] text-black" style={styles.nAc}>Need an Account?</Text>  
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="items-center ">
                  <Text className="text-[16px]" style={styles.btnText1}>Sign Up</Text>
              </TouchableOpacity>
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
    backgroundColor:"#fff",
  },

  // Application Login Background
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
    minWidth: "50%",
    maxWidth: "60%",
    minHeight: "50%",
    maxHeight: "50%",
    alignSelf:"center",
    marginTop:-20
  },
  //


  content:{
    flexGrow: .2,
    justifyContent: 'space-evenly',
  },

  //Input Fields
  inputFields:{
    marginTop:25,
    alignItems: "center",
    flexGrow: .2,
    justifyContent: 'space-evenly',
    paddingBottom: 10,
    height: "25%"
  },
  inputTxt:{
    fontFamily: 'Poppins_600SemiBold',
    padding:1,
  },
  //Input Text Design
  borderStyle:{
    borderColor:'#006738',
    marginTop:10,
  },
  //  
  //

  //Buttons
  btnDvd:{
    marginTop:-80
  },
  //Button Designs
  btnDes:{
    borderColor:'#006738',
    alignSelf:'center'
  },
  btnText:{  
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  //
  //
  
  //Buttons for Creating Account and Forgot Password (TEXT BUTTONS
  etcBtn:{
    alignSelf: 'center',
    width:"50%",
    height:"50%",
    flexGrow: .1,
    alignItems: "center",
    marginTop: 20
  },
  nAc:{
    fontFamily: 'Poppins_500Medium',
  },
  btnText1:{
    fontFamily: 'Poppins_500Medium',
    color: "#006738",
  }
  //
})