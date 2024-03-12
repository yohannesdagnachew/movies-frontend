import React, {useEffect, useLayoutEffect, useState} from 'react'
import { View, Text, BackHandler, Alert } from 'react-native'
import YoutubeIframe from 'react-native-youtube-iframe'
import * as ScreenOrientation from 'expo-screen-orientation';
import { Dimensions } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PlayScreen({navigation, route}) {

  const { videoId, image, title } = route.params
  const [adsCounter, setAdsCounter] = useState(0)
  const  isFocused  = useIsFocused();


    useFocusEffect(
        React.useCallback(() => {
          async function changeScreenOrientation() {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
          }
       
            changeScreenOrientation();
        }, [])
      );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    useEffect(() => {
      if (!isFocused) {
        return;
      }
      setAdsCounter(adsCounter + 1)
      const onBackPress = () => {
        navigation.navigate("KanaDitails", {
          title: title,
          image: image,
          runAds: adsCounter % 1 === 0 ? true : false
        })
        return true;
      };
   
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
   
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackPress
        );
    }
    , [isFocused])


    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black'
        }}>
            <YoutubeIframe
        videoId={route.params.videoId}
        height={SCREEN_WIDTH}
        width={SCREEN_HEIGHT}
        play={true}
        onError={() => {
          Alert.alert('Error', 'Please check your connection')
        }}
        webViewProps={{
          injectedJavaScript: `
            var element = document.getElementsByClassName('container')[0];
            element.style.position = 'unset';
            element.style.paddingBottom = 'unset';
            true;
          `,
        }}
      />
        </View>
    )
}
