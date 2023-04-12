import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
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
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";

const AllHistory = ({ historyBG }) => {
  const { user } = useContext(UserContext);
  const [allLog, setAllLog] = useState([]);

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
        await readAllHistory();
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user, loading]);

  const readAllHistory = async () => {
    try {
      const API_URL = "http://192.168.4.6/API/ReadAllHistory.php";
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
          Room_Number: record.room,
          TimeIn: `${record.TimeIn_Date} ${record.TimeIn_Time}`,
          TimeOut: `${record.TimeOut_Date} ${record.TimeOut_Time}`,
        }));
        setAllLog(formattedData);
      } else {
        console.log("No Data");
      }
    } catch (error) {
      console.log(error);
      // Alert.alert("An error occurred while fetching data from the server.");
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataStart, setDataStart] = useState(0);
  const [dataEnd, setDataEnd] = useState(3);

  useEffect(() => {
    setTotalPage(Math.ceil(allLog.length / 3) == 0 ? 1 : Math.ceil(allLog.length / 3));
    setCurrentPage(1);
    setDataStart(0);
    setDataEnd(3);

    return () => {};
  }, [allLog]);

  const handleNextPage = () => {
    if (currentPage != totalPage) {
      setDataStart(dataStart + 3);
      setDataEnd(dataEnd + 3 > allLog.length ? allLog.length : dataEnd + 3);
      setCurrentPage(currentPage + 1);
    } else {
      return;
    }
  };

  const handlePrevPage = () => {
    if (currentPage != 1) {
      setDataStart(dataStart - 3);
      setDataEnd(dataEnd - 3 <= 3 ? 3 : dataEnd - 3);
      setCurrentPage(currentPage - 1);
    } else {
      return;
    }
  };
  //Pagination

  if (!isReady || !fontsLoaded) {
    return null;
  }
  return (
    <View>
      <View style={{marginHorizontal: 4, width: Dimensions.get("window").width - 40, borderTopLeftRadius: 5, backgroundColor: '#006738', flexDirection: "row",justifyContent: "flex-start",alignItems: "center",paddingTop:10,}}>
        <TouchableOpacity onPress={() => { handlePrevPage(); }} >
          <Ionicons name="chevron-back-outline" size={35} color={"#fff"} />
        </TouchableOpacity>
        <Text style={{color:'#fff'}}>{currentPage}</Text>
        <Text style={{color:'#fff'}}> of </Text>
        <Text style={{color:'#fff'}}>{totalPage}</Text>
        <TouchableOpacity onPress={() => { handleNextPage(); }} >
          <Ionicons name="chevron-forward-outline" size={35} color={"#fff"} />
        </TouchableOpacity>
      </View>
      {allLog.length != 0 ? (
        <>
          <FlatList
            refreshing={loading}
            onRefresh={() => {
              setLoading(true);
            }}
            style={[
              styles.containerShadow,
              { backgroundColor: historyBG == true ? "#006738" : "#fff" },
            ]}
            data={allLog.slice(dataStart,dataEnd)}
            keyExtractor={(item) => item.ID}
            renderItem={({ item: data }) => (
              <View>
                <View
                  style={{
                    marginVertical: 10,
                    backgroundColor: "white",
                    width: "70%",
                    alignSelf: "center",
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: historyBG == true ? "#006738" : "#fff",
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 20,
                    }}
                  >
                    {data.Room_Number}
                  </Text>
                  {data.TimeOut != "0000-00-00 00:00:00" ? (
                    <View
                      style={{
                        padding: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                    >
                      <View style={{ flexDirection: "column" }}>
                        <Text
                          style={[
                            styles.cntText,
                            {
                              color: historyBG == true ? "#006738" : "#fff",
                              fontFamily: "Poppins_500Medium",
                              fontSize: 18,
                            },
                          ]}
                        >
                          Out
                        </Text>
                        <Text
                          style={[
                            styles.cntText,
                            {
                              color: historyBG == true ? "#006738" : "#fff",
                              fontFamily: "Poppins_500Medium",
                              fontSize: 18,
                            },
                          ]}
                        >
                          {data.TimeOut}
                        </Text>
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
                  ) : (
                    <></>
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
                        <Text
                          style={[
                            styles.cntText,
                            {
                              color: historyBG == true ? "#006738" : "#fff",
                              fontFamily: "Poppins_500Medium",
                              fontSize: 18,
                            },
                          ]}
                        >
                          IN
                        </Text>
                        <Text
                          style={[
                            styles.cntText,
                            {
                              color: historyBG == true ? "#006738" : "#fff",
                              fontFamily: "Poppins_500Medium",
                              fontSize: 18,
                            },
                          ]}
                        >
                          {data.TimeIn}
                        </Text>
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
              </View>
            )}
          />
        </>
      ) : (
        <>
          <View
            style={[
              styles.containerShadow,
              { backgroundColor: historyBG == true ? "#006738" : "#fff" },
            ]}
          >
            <View
              style={{
                padding: 10,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Text
                style={[
                  styles.cntText,
                  {
                    color: historyBG == true ? "#fff" : "#006738",
                    fontFamily: "Poppins_500Medium",
                    fontSize: 18,
                  },
                ]}
              >
                No Data
              </Text>
              <TouchableOpacity style={{marginTop:20}} onPress={()=>setLoading(true)}>
                {loading == true ? <ActivityIndicator size={"large"}/> : <Ionicons name="refresh" size={30} color={"#fff"}/>}
              </TouchableOpacity>
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
    flexGrow: 0.8,
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: Dimensions.get("window").width - 40,
    // borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  carouselContentContainer: {
    flexGrow: 1,
    overflow: "hidden",
  },

  ctnDvd: {
    borderBottomWidth: 2,
    borderColor: "white",
    width: "60%",
    alignSelf: "center",
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
