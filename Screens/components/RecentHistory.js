import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Alert,
  Dimensions,
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
import { ActivityIndicator } from "react-native";

const RecentHistory = () => {
  const { user } = useContext(UserContext);
  const [recentLog, setRecentLog] = useState([]);
  const [dateToday, setDateToday] = useState([]);

  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      try {
        await getDate();
        setLoading(false);
      } catch (error) {
        console.log(error);
        Alert.alert("An error occurred while fetching data from the server.");
      }
    };
    fetchData();
  }, [user]);

  const getDate = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDateToday(formattedDate);
    await readRecent(formattedDate);
  };

  const readRecent = async (date) => {
    try {
      const API_URL = "http://192.168.1.13/API/ReadRecentTimeIn.php";
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const data = {
        userID: user.id,
        dateToday: date, // use the argument instead of state variable
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.length && responseData[0].Data !== "No data") {
        const formattedData = responseData.map((record) => ({
          ID: record.ID,
          TimeIn: `${record.TimeIn_Date} ${record.TimeIn_Time}`,
          TimeOut: `${record.TimeOut_Date} ${record.TimeOut_Time}`,
        }));
        setRecentLog(formattedData);
      } else {
        console.log("No Data");
      }
    } catch (error) {
      throw error;
    }
  };

  if (!isReady || !fontsLoaded) {
    return null;
  }
  return (
    <View>
      {recentLog.length != 0 && !loading ? (
        <>
          <FlatList
            style={styles.containerShadow}
            data={recentLog}
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
                      <Text>OUT</Text>
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

export default RecentHistory;

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
