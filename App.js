import { StyleSheet, Text, View,Platform } from 'react-native';
import 'react-native-gesture-handler';
import PlayScreen from './Screens/PlayScreen';
import HomeScreen from './Screens/HomeScreen';
import KanaScreen from './Screens/KanaScreen';
import KanaDitailsScreen from './Screens/KanaDitailsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import 'expo-dev-client';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import axios from 'axios';


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
          return;
        }
        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        });
    
      } else {
        alert('Must use physical device for Push Notifications');
      }
  
      if(token){  
        const url = "https://kana.tv.ethiochewata.com/api/kana/notification";
        try {
          const response = await axios.post(url, {
            token: token.data
          });
        } catch (error) {
          console.error('Failed to send push token:');
        }
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
          drawerActiveBackgroundColor: "#95087C",
          drawerActiveTintColor: "#fff",
         }}
         >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Play" component={PlayScreen} 
             options={{
              drawerItemStyle: { height: 0, display: "none" },
            }}
          />
          <Drawer.Screen name="KanaDitails" component={KanaDitailsScreen}
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
