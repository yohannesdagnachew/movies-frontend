import React, {useEffect, useLayoutEffect, useState} from 'react';
import { View, StyleSheet, Button, Dimensions, BackHandler, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';



export default function KanaScreen({navigation, route}) {
  useKeepAwake();
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const { videoId, image, title } = route.params
  const [adsCounter, setAdsCounter] = useState(0)

  


  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    })
}, [])



  useFocusEffect(
    React.useCallback(() => {
      async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
      }
   
        changeScreenOrientation();
    }, [])
  );

 
  useEffect(() => {
    if (!isFocused) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [isFocused]);

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
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#00ff00"  style={styles.activity} />}
      <Video
        shouldPlay={isPlaying}
        resizeMode={ResizeMode.STRETCH}
        isMuted={false}
        ref={video}
        style={{ width: width, height: height }}
        source={{
          uri: route.params.videoId,
        }}
        useNativeControls
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoad={() => {
          setLoading(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  video: {
    alignSelf: 'center',
    backgroundColor: 'black',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activity: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
});