import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center justify-center">
      <AntDesign name="menu-fold" size={24} color="black"/>
      <TouchableOpacity onPress={() =>{navigation.navigate("TimeIn")}} className="border-2 p-2 rounded-[10px]">
        <Text>Time In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>{navigation.navigate("TimeOut")}} className="border-2 p-2 rounded-[10px]">
        <Text>Time Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    contain:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#0000",
    }
})