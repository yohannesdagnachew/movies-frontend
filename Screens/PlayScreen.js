import React, {useEffect, useLayoutEffect, useState} from 'react'
import { View, Text } from 'react-native'
import YoutubeIframe from 'react-native-youtube-iframe'
import * as ScreenOrientation from 'expo-screen-orientation';
import { Dimensions } from "react-native";
import { useFocusEffect } from '@react-navigation/native';



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PlayScreen({navigation, route}) {

   
    



    useFocusEffect(
        React.useCallback(() => {
          async function changeScreenOrientation() {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
          }
       
            changeScreenOrientation();
        }, [])
      );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

  

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
