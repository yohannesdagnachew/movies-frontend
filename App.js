import { StyleSheet, Text, View, Platform } from 'react-native';
import 'react-native-gesture-handler';
import PlayScreen from './Screens/PlayScreen';
import HomeScreen from './Screens/HomeScreen';
import KanaScreen from './Screens/KanaScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import 'expo-dev-client';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import { useEffect } from 'react';


const Drawer = createDrawerNavigator();


export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });


  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      let token;
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        });
    
      } else {
        alert('Must use physical device for Push Notifications');
      }
  
      if(token){  
        const url = "https://cloudy-turtleneck-shirt-bull.cyclic.app/api/movies/notification";
        try {
          const response = await axios.post(url, {
            token: token.data
          });
        } catch (error) {
          console.error('Failed to send push token:');
        }
        console.log(token.data)
      }
      return token
    }

     registerForPushNotificationsAsync()
  }, []);

  return (
    <>
     <StatusBar style="auto" />
      <NavigationContainer>
         <Drawer.Navigator
         screenOptions = {{
          drawerActiveBackgroundColor: "#2098AE",
          drawerActiveTintColor: "#fff",
         }}
         >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Play" component={PlayScreen} 
             options={{
              drawerItemStyle: { height: 0, display: "none" },
            }}
          />
          <Drawer.Screen name="Kana" component={KanaScreen} 
          
          options={{
            drawerItemStyle: { height: 0, display: "none" },
          }}

          />
        </Drawer.Navigator>
      </NavigationContainer>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
