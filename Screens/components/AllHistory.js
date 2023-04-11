import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import { UserContext } from "../../hooks/useAuth";

const AllHistory = () => {
  const { user } = useContext(UserContext);
  const [allLog, setAllLog] = useState([]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
    return () => {
      SplashScreen.hideAsync();
    };
  }, [isReady]);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  useEffect(() => {
    readAllHistory();
  }, [user]);

  const readAllHistory = async () => {
    try {
      const API_URL = "http://192.168.1.13/API/ReadAllHistory.php";
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const data = {
        userID: user.id,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData[0]?.Data !== "No data") {
        const formattedData = responseData.map((record) => ({
          ID: record.ID,
          TimeIn: `${record.TimeIn_Date} ${record.TimeIn_Time}`,
          TimeOut: `${record.TimeOut_Date} ${record.TimeOut_Time}`,
        }));
        setAllLog(formattedData);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("An error occurred while fetching data from the server.");
    }
  };

  if (!isReady || !fontsLoaded) {
    return null;
  }
  return (
    <View>
      {allLog.length != 0 ? (
        <>
          <FlatList
            style={styles.containerShadow}
            data={allLog}
            keyExtractor={(item) => item.ID}
            renderItem={({ item: data }) => (
              <View>
                {data.TimeOut && (
                  <View
                    style={{
                      padding: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={{ flexDirection: "column" }}>
                      <Text>Out</Text>
                      <Text>{data.TimeOut}</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: 100,
                        backgroundColor: "red",
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                )}
                {data.TimeIn && (
                  <View
                    style={{
                      padding: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={{ flexDirection: "column" }}>
                      <Text>IN</Text>
                      <Text>{data.TimeIn}</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: 100,
                        backgroundColor: "green",
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                )}
              </View>
            )}
          />
        </>
      ) : (
        <>
          <View style={styles.containerShadow}>
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Text>No Data</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default AllHistory;

const styles = StyleSheet.create({
  containerShadow: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 4,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: Dimensions.get("window").width - 40,
  },
  carouselContentContainer: {
    flexGrow: 1,
    overflow: "hidden",
  },

  //HOME TITLE
  titHome: {
    fontSize: 30,
    color: "#006738",
    paddingLeft: 15,
    fontFamily: "Poppins_700Bold",
  },
  //

  //TIME IN TIME OUT BUTTON
  timeInOut: {
    flexGrow: 0.1,
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "space-evenly",
  },

  tIOcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  tioTEXT: {
    fontFamily: "Poppins_500Medium",
  },

  tioTEXTbtn: {
    fontFamily: "Poppins_600SemiBold",
    color: "#006738",
  },
  //
});
