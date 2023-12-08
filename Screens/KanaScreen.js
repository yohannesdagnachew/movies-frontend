import React, {useEffect, useLayoutEffect, useState} from 'react';
import { View, StyleSheet, Button, Dimensions, BackHandler } from 'react-native';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';



export default function KanaScreen({navigation, route}) {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const isFocused = useIsFocused();


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




  return (
    <View style={styles.container}>
      <Video
        shouldPlay={isPlaying}
        isMuted={false}
        ref={video}
        style={{ width: width, height: height }}
        source={{
          uri: route.params.videoId,
        }}
        useNativeControls
        resizeMode="contain"
        onPlaybackStatusUpdate={status => setStatus(() => status)}
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
});