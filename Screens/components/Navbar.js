import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { UserContext } from '../../hooks/useAuth';

const Navbar = ({ handleActiveNavigation }) => {
    const { logout } = useContext(UserContext)
    const [currentTab, setCurrentTab] = useState("Home");

    const logoutHandler = () =>{
      logout();
    }
    const TabButton = (currentTab, setCurrentTab, title, icon) => {
        return (
          <TouchableOpacity onPress={() => {
            title == "LogOut" ? logoutHandler(): ( setCurrentTab(title), handleActiveNavigation(title));
          }}>
            <View style={{flexDirection: "row",alignItems: 'center',paddingVertical: 8,backgroundColor: currentTab == title ? 'white' : 'transparent',paddingLeft: 13,paddingRight: 35,borderRadius: 8,marginTop: 15}}>
              <Ionicons name={icon} size={25} color={currentTab == title ? "#006738" : 'white'}/>
              <Text style={{fontSize: 15,fontWeight: 'bold',paddingLeft: 15,color: currentTab == title ? "#006738" : "white"}}>{title}</Text>
            </View>
          </TouchableOpacity>
        );
      }

    return (
      <View style={{ justifyContent: 'flex-start', padding: 15 }}>
        <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpd4mJRIUwqgE8D_Z2znANEbtiz4GhI4M8NQ&usqp=CAU'}} style={{width: 60,height: 60,borderRadius: 10,marginTop: 30 }}/>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginTop: 20 }}>User Name</Text>
        <TouchableOpacity>
          <Text style={{marginTop: 6,color: 'white'}}>Instructor</Text>
        </TouchableOpacity>
        <View style={{ flexGrow: 1, marginTop: 50 }}>
          {TabButton(currentTab, setCurrentTab, "Home", "home-outline")}
          {TabButton(currentTab, setCurrentTab, "Subjects", "book-outline")}
          {TabButton(currentTab, setCurrentTab, "Settings", "settings-outline")}
        </View>
        <View>
          {TabButton(currentTab, setCurrentTab, "LogOut", "log-out-outline")}
        </View>
      </View>
    )
  }

export default Navbar



const styles = StyleSheet.create({})