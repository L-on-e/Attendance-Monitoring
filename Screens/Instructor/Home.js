import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity onPress={() =>{navigation.navigate("QRScanner")}} className="border-2 p-2 rounded-[10px]">
        <Text>Scan QR Code</Text>
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