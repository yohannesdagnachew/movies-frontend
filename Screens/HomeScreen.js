import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  RefreshControl,
} from "react-native";
import { getAmharicMovies } from "../Api/http";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../components/Loader";
import UpdateModal from "../components/Update";
import amazonList from '../utils/amzonList';


const appVersion = 1.0;

export default function HomeScreen({ navigation }) {
  const [amhricMovies, setAmharicMovies] = useState([]);
  const [allAmharicMovies, setAllAmharicMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [isReady, setIsReady] = useState(false)

  const loadData = async () => {
    const data = await getAmharicMovies();
    
    const backEndAppVersion = Number(data.appVersion);
    const isReadyBackEnd = data.isReady;
    if(isReadyBackEnd === true){
      setIsReady(true)
    }
    if (backEndAppVersion > appVersion) {
      setUpdateVisible(true);
    }
    setLoading(false);
    let allAmharic = data.data;
    setAmharicMovies(allAmharic);
    setAllAmharicMovies(allAmharic);
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }

      changeScreenOrientation();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Amharic Movies",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#2098AE",
      },
      headerTintColor: "#000",
    });
  }, []);

  const list = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          if(isReady){
          navigation.navigate("Play", {
            videoId: item.videoId,
          })
          return
         }
         navigation.navigate("Kana", {
          videoId: item.videoId,
          videoRef: null
        })
        }}
        style={styles.listItem}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: "100%", height: 170, borderRadius: 8 }}
        />
      </Pressable>
    );
  };

  const searchHandler = () => {
    const filteredMovies = allAmharicMovies.filter((movie) => {
      return (
        movie.engTitle.toLowerCase().includes(search.toLowerCase()) ||
        movie.amhTitle.includes(search)
      );
    });
    setAmharicMovies(filteredMovies);
  };

  return (
    <View style={styles.container}>
      {amhricMovies ? (
        <>
          {updateVisible ? (
            <UpdateModal
              visible={updateVisible}
              setVisible={setUpdateVisible}
            />
          ) : (
            <>
              {isReady && <Loader visible={loading} />}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    if (text === "") {
                      setAmharicMovies(allAmharicMovies);
                      return;
                    }
                    setSearch(text);
                    searchHandler();
                  }}
                />
                <AntDesign
                  name="search1"
                  size={24}
                  color="black"
                  onPress={searchHandler}
                />
              </View>

              <View style={{ width: "100%" }}>
                <FlatList
                  data={isReady ? amhricMovies : amazonList}
                  renderItem={list}
                  numColumns={2}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={loadData}
                    />
                  }
                />
              </View>
            </>
          )}
        </>
      ) : (
        <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>Not Available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  listItem: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  searchContainer: {
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
  },
});
