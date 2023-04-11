import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

export const UserContext = createContext();

const UserContextProvider = (props) =>{
  const [user, setUser] = useState(null);
  
  useEffect(() =>{
    SecureStore.getItemAsync('userToken')
    .then((userToken) =>{
      if (userToken){
        setUser(JSON.parse(userToken));
      }
    })
    .catch((error) => console.log(error));
  },[])
  

  const login = (ID, password) =>{
    const APIURL = "http://192.168.1.12/API/Login.php";
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
    .then((response) => {
      return response.json();
    })
    .then((response) =>{
      const verify = response.User;
      if (response.Message == 'User does not exist') Alert.alert("User does not exist");
      else if (response.Message == 'Password is wrong') Alert.alert("Password is wrong");
      else if(response.User == 'Password is wrong') Alert.alert("Password is wrong");
      else if (verify.isVerified != 1) Alert.alert('Wait for the admin confirmation');
      else if (response && response.User) {
        const user = response.User;
        const secretKey = Constants.manifest.extra.secretKey;
        const userToken = Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `${user.id}${user.name}${user.profilePhoto}${secretKey}`
          );
        SecureStore.setItemAsync('userToken', JSON.stringify(userToken))
        .then(()=> setUser(user))
        .catch((error) => console.log(error));
      }else {
        Alert.alert("Error logging in");
        console.log("User not found in response");
      }
    })
  .catch((error)=>console.log(error));
  }
  // console.log(user);
  const logout = () => {
    SecureStore.deleteItemAsync('userToken')
      .then(() => {
        setUser(null);
      })
      .catch((error) => console.error('Error deleting user token:', error));
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {props.children}
    </UserContext.Provider>
  );
}
export default UserContextProvider;
