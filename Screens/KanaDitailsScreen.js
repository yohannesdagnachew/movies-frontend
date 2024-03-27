import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  ImageBackground,
  BackHandler,
} from "react-native";
import { getKana } from "../Api/http";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useInterstitialAd,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import Loader from "../components/Loader";


const appVersion = 1.0;
const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-8562038685299408/8240951432";

const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-8562038685299408/1273052554";

  const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
    keywords: ['fashion', 'clothing'],
  }); 

export default function KanaDitailsScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const [kanamovies, setKanamovies] = useState();
  const [currentPart, setCurrentPart] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(route.params.title);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const { isLoaded, isClosed, load, show } = useInterstitialAd(
    interstitialAdUnitId,
    {
      requestNonPersonalizedAdsOnly: true,
    });
    

  const { title, image, runAds } = route.params;
  useEffect(() => {
    const fetchKana = async () => {
      const response = await getKana(title);
      setLoading(false);
      setKanamovies(response.data.data);
    };

    fetchKana();
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#95087C",
      },
      headerTintColor: "#fff",
    });
  }, [route]);


  useEffect(() => {
    setLoading(true);
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [isFocused]);


  useEffect(() => {
    if(loaded && isFocused){
      interstitial.show();
      setLoaded(false);
    }
  }, [isFocused]);

  // useEffect(() => {
  //   if (isLoaded) {
  //     show()
  //   }
  // }, [isLoaded]);


  useFocusEffect(
    useCallback(() => {
      load();
      async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }

      changeScreenOrientation();
    }, [])
  );
  

  const list = ({ item }) => {
    let isClicked = false;
    if (currentPart === item.part && currentTitle === title) {
      isClicked = true;
    }


    return (
      <Pressable
        onPress={() => {
          if(item.level === 2){
            setCurrentPart(item.part);
            setCurrentTitle(title);
            navigation.navigate("Kana", {
              videoId: item.videoId,
              videoRef: null,
              title: title,
              image: image,
              demo: false,
            });
            return;
          }
          setCurrentPart(item.part);
          setCurrentTitle(title);
          navigation.navigate("Play", {
            videoId: item.videoId,
            videoRef: null,
            title: title,
            image: image,
          });
        }}
        style={styles.listItem}
      >
        <ImageBackground
          source={{ uri: image }}
          style={styles.ImageBackground}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        >
          <View>
            <Text
              style={[
                styles.text,
                isClicked
                  ? { backgroundColor: "#E1AD01" }
                  : { backgroundColor: "black" },
              ]}
            >
              Part {item.part}
            </Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <View>
     <View style={styles.bannerAds}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
      <Loader visible={loading} />
      <View style={{ width: "100%", bottom: 70, marginTop: 70 }}>
        <FlatList data={kanamovies} renderItem={list} numColumns={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    lineHeight: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  ImageBackground: {
    width: "100%",
    height: 170,
    borderRadius: 50,
    flex: 1,
    justifyContent: "flex-end",
  },
  bannerAds: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
  },

});
