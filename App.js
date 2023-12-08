import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import PlayScreen from './Screens/PlayScreen';
import HomeScreen from './Screens/HomeScreen';
import KanaScreen from './Screens/KanaScreen';
import KanaDitailsScreen from './Screens/KanaDitailsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import 'expo-dev-client';


const Drawer = createDrawerNavigator();


export default function App() {
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
