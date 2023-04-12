import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Octicons } from '@expo/vector-icons'; 
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../hooks/useAuth";
import * as ImagePicker from "expo-image-picker";

const Navbar = ({ handleActiveNavigation }) => {
  const { user, logout } = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState("Home");
  const tempo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnu-_OQu5Clvfk0WgCGmE1k0A4naXq0UMVAw&usqp=CAU";
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto == "" ? tempo:user.profilePhoto);

  const logoutHandler = () => {
    logout();
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        let response = result.assets.map((data) => data.uri);
        let filePath = response[0];
        const data = await fetch(filePath);
        const blob = await data.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result;
          // console.log(base64String);
          await uploadImage(base64String);
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (base64String) => {
    try {
      const API_URL = "http://192.168.4.6/API/uploadImage.php";
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const data = {
        userID: user.id,
        profilePhoto: base64String,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.Message == "Record updated successfully.") {
        Alert.alert("Profile Photo Uploaded!");
        fetchNewProfile();
      } else {
        Alert.alert("Error Uploading Photo!");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("An error occurred while fetching data from the server.");
    }
  };

  const fetchNewProfile = async () => {
    const APIURL = "http://192.168.4.6/API/fetchProfilePhoto.php";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application.json",
    };
    let data = {
      id: user.id,
    };
    fetch(APIURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response && response.User) {
          const imageURI = response.User.profilePhoto;
          setProfilePhoto(imageURI);
        } else {
          console.log("Error in Fetching");
        }
      })
      .catch((error) => console.log(error));
  };

  const TabButton = (currentTab, setCurrentTab, title, icon) => {
    return (
      <TouchableOpacity
        onPress={() => {
          title == "LogOut"
            ? logoutHandler()
            : (setCurrentTab(title), handleActiveNavigation(title));
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            backgroundColor: currentTab == title ? "white" : "transparent",
            paddingLeft: 13,
            paddingRight: 35,
            borderRadius: 8,
            marginTop: 15,
          }}
        >
          <Ionicons
            name={icon}
            size={25}
            color={currentTab == title ? "#006738" : "white"}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              paddingLeft: 15,
              color: currentTab == title ? "#006738" : "white",
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ justifyContent: "flex-start", padding: 15 }}>
      <TouchableOpacity onPress={() => pickImage()}>
        <Image
          source={{ uri: profilePhoto }}
          style={{ width: 60, height: 60, borderRadius: 10, marginTop: 30}}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "white",
          marginTop: 20,
        }}
      >
        {user.name}
      </Text>
      <TouchableOpacity>
        <Text style={{ marginTop: 6, color: "white" }}>Instructor</Text>
      </TouchableOpacity>
      <View style={{ flexGrow: 1, marginTop: 50 }}>
        {TabButton(currentTab, setCurrentTab, "Home", "home-outline")}
        {/* {TabButton(currentTab, setCurrentTab, "Subjects", "book-outline")} */}
        {TabButton(currentTab, setCurrentTab, "Settings", "settings-outline")}
      </View>
      <View>
        {TabButton(currentTab, setCurrentTab, "LogOut", "log-out-outline")}
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({});
