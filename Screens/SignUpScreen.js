import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

const SignUpScreen = () => {
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
  const [ID, setID] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const ValidateCredentials = () =>{
    if (ID.length == 0) Alert.alert("ID is required");
    else if (name.length == 0) Alert.alert("Username is required");
    else if (email.length == 0) Alert.alert("Email is required");
    else if (department.length == 0) Alert.alert("Department is required");
    // else if (password.length == 0) Alert.alert("Password is required");
    // else if (password.length < 8) Alert.alert("Password must have 8 characters or more");
    // else if (confirmPassword.length == 0) Alert.alert("Confirm Password is required");
    // else if (password != confirmPassword) Alert.alert("Password does not match");
    else Register();
  }

  const Register = () =>{
    const APIURL = "http://192.168.1.2/API/Register.php";
    const headers = {
      'Accept':'application/json',
      'Content-Type':'application.json'
    }
    let data = {
      id: ID,
      password: password,
      instructorName: name,
      email: email,
      department: department,
    }

    fetch(APIURL,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
    .then((response) =>
      response.json())  
    .then((response) =>{
      response[0].message == "Error inserting record" ? 
        Alert.alert("Error inserting record")  
        : response[0].message == "User Already Exist" ?
        Alert.alert("User Already Exist")  
        :
        Alert.alert("Success", "Record Inserted", [{text: 'Continue', onPress : () =>{navigation.navigate("SignIn")}}]);   
    })
    .catch((error)=>console.log(error));
  }
  
  if (!isReady || !fontsLoaded) { return null;}
  return (
   
      <LinearGradient
        // Background Linear Gradient
        start={{ x: 1, y: .0}}
        end={{ x: 1, y: 1}}
        colors={['#fff','transparent','#006738']}
        style={styles.background}
      >

<TouchableOpacity onPress={()=>navigation.goBack()} className="self-start" style={styles.backArrow}>
          <Ionicons name='arrow-back' size={35}/>
      </TouchableOpacity>
      
      <View className="flex-column items-center">        
        <Text className="text-4xl" style={styles.createHead}>Create Account</Text>
        <Text className="text-1xl" style={styles.createSubTxt}>Create a new Account</Text>
      </View>


      <View style={styles.inputLayout} className="flex-column items-center">
        <View className="border-2 w-64 p-1 h-10 rounded-[12px]" style={styles.borderColor}>
          <TextInput className="w-full text-[18px] text-center" onChangeText={text=>setID(text)} placeholder="ID" placeholderTextColor="#006738" style={styles.inputTxt}/> 
        </View>
        
        <View className="border-2 w-64 p-1 h-10 rounded-[12px] " style={styles.borderColor}>
          <TextInput className="w-full text-[18px] text-center" onChangeText={text=>setName(text)} placeholder="USERNAME" placeholderTextColor="#006738" style={styles.inputTxt}/>   
        </View>

        <View className="border-2 w-64 p-1 h-10 rounded-[12px] " style={styles.borderColor}>
          <TextInput className="w-full text-[18px] text-center" onChangeText={text=>setEmail(text)} placeholder="EMAIL" placeholderTextColor="#006738" style={styles.inputTxt}/>   
        </View>

        <View className="border-2 w-64 p-1 h-10 rounded-[12px]" style={styles.borderColor}>
          <TextInput className="w-full text-[18px] text-center" onChangeText={text=>setDepartment(text)} placeholder="DEPARTMENT" placeholderTextColor="#006738" style={styles.inputTxt}/>
        </View>

        <View className="border-2 w-64 p-1 h-10 rounded-[12px] " style={styles.borderColor}>
          <TextInput className="w-full text-[18px] text-center" secureTextEntry onChangeText={text=>setPassword(text)} placeholder="PASSWORD" placeholderTextColor="#006738" style={styles.inputTxt}/>
        </View>

        <View className="border-2 w-64 p-1 h-10 rounded-[12px]" style={styles.borderColor}>
          <TextInput className="w-full text-[18px] text-center" secureTextEntry onChangeText={text=>setConfirmPassword(text)} placeholder="CONFIRM PASSWORD" placeholderTextColor="#006738" style={styles.inputTxt}/>
        </View>
      </View>

      <View className="flex-column items-center" style={styles.buttonsDVD}>
        <TouchableOpacity className="border-2 p-2 w-1/2 h-10 rounded-[10px] items-center bg-[#006738] border-transparent" style={styles.creatBTn}>
          <Text className="text-white text-[18px]" onPress={()=>ValidateCredentials()} style={styles.btnText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>


        <View className="flex-row"  style={styles.btnBfText}>
              <Text className="text-[16px] text-black" style={styles.btnText2}>Have an Account?</Text>  
              <TouchableOpacity onPress={() => navigation.goBack()} className="items-center ">
                  <Text className="text-[16px]" style={styles.btnText1}>Sign In</Text>
              </TouchableOpacity>
        </View>
      </View>


      </LinearGradient>
    
  )
}

export default SignUpScreen

const styles = StyleSheet.create({


  background:{
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex:1
  },

  createHead:{
    marginTop: 40,
    fontFamily: 'Poppins_600SemiBold',
    color: "#006738"
  },

  createSubTxt:{
    fontFamily: "Poppins_500Medium",
    opacity: 0.5
  },
  backArrow:{
    marginLeft:10,
    marginTop:15
  },
  btnText:{
    fontFamily: 'Poppins_600SemiBold',
  },
  creatBTn:{
    marginTop: 20
  },

  btnBfText:{
    marginTop: 20
  },

  inputTxt:{
    fontFamily: 'Poppins_600SemiBold',
  },
  btnText1:{
    fontFamily: 'Poppins_600SemiBold',
    color: "#fff",
    marginLeft: 5
  },
  btnText2:{
    fontFamily: 'Poppins_500Medium',
    color: "black",
    marginLeft: 5
  },
  borderColor:{
    borderColor: "#006738",
    marginTop:25
  },

  buttonsDVD:{
    marginTop:30
  }

});