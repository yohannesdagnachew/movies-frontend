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
  ImageBackground,
  Dimensions,
} from "react-native";
import { getAmharicMovies } from "../Api/http";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../components/Loader";
import UpdateModal from "../components/Update";
import amazonList from "../utils/amzonList";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useInterstitialAd
} from "react-native-google-mobile-ads";
import {useIsFocused} from '@react-navigation/native'


const appVersion = 2.0;
const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-8956332832407416/1938716289";

const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-8956332832407416/7920559916';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [amhricMovies, setAmharicMovies] = useState([]);
  const [allAmharicMovies, setAllAmharicMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [runAds, setRunAds] = useState(0)
  const { isLoaded, isClosed, load, show } = useInterstitialAd(interstitialAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });


  
  const loadData = async () => {
    const data = await getAmharicMovies();
    const backEndAppVersion = Number(data.appVersion);
    setIsReady(data.isReady);
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
      headerTitle: "Kana Tv",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#95087C",
      },
      headerTintColor: "#fff",
    });
  }, []);

  const list = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          setRunAds(runAds + 1)
          if (isReady) {
            navigation.navigate("KanaDitails", {
              title: item.amTitle,
              image: item.thumbnail,
              runAds: false
            });
            return;
          }
          navigation.navigate("Kana", {
            videoId: item.videoId,
            videoRef: null,
          });
        }}
        style={styles.listItem}
      >
        <ImageBackground 
        source={{ uri: item.thumbnail }}
        style= {styles.ImageBackground}
        imageStyle={{ borderRadius: 10}}
        resizeMode="cover"
        >
          <View>
          <Text style={styles.text}>{item.enTitle}</Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

 
  return (
    <View style={styles.container}>
      <View style={styles.bannerAds}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>

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
              <View style={{ width: "100%", bottom: 70, marginTop: 70 }}>
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
        <Text
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          Not Available
        </Text>
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
  bannerAds: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0
  },
  text: {
    color: 'white',
    fontSize: 20,
    lineHeight: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'black',
  },
  ImageBackground: {
    width: "100%",
    height: 170,
    borderRadius: 50,
    flex: 1,
    justifyContent: "flex-end",
  }
});
