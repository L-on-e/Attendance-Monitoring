import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const SignUpScreen = () => {
  const navigation = useNavigation();
  const [ID, setID] = useState(null);
  const [name, setName] = useState(null);
  const [department, setDepartment] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const signUp = () =>{
    //validate first the password
    register();
  }
  const register = () =>{
    const APIURL = "http://192.168.109.37/API/Register.php";
    const headers = {
      'Accept':'application/json',
      'Content-Type':'application.json'
    }
    let data = {
      id: ID,
      password: password,
      instructorName: name,
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
      response[0].message == "User does not exist" ? 
        Alert.alert("Register now")  
      // navigation.dispatch(StackActions.replace('Home')) 
        :  Alert.alert(response[0].message);  
    })
    .catch((error)=>console.log(error));
  }

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name='chevron-back-outline' size={30}/>
      </TouchableOpacity>
      <Text>Sign Up</Text>
      <TextInput value={ID} onChangeText={(text)=>setID(text)} placeholder='ID'/>
      <TextInput value={name} onChangeText={(text)=>setName(text)} placeholder='Name'/>
      <TextInput value={department} onChangeText={(text)=>setDepartment(text)} placeholder='Department'/>
      <TextInput value={password} onChangeText={(text)=>setPassword(text)} placeholder='Password'/>
      <TextInput value={confirmPassword} onChangeText={(text)=>setConfirmPassword(text)} placeholder='Confirm Password'/>
      <View className="w-screen flex-row justify-evenly">
        <TouchableOpacity className="p-3 w-1/3 items-center border-[2px] rounded-[10px]">
          <Text>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signUp} className="p-3 w-1/3 items-center border-[2px] rounded-[10px]">
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SignUpScreen
