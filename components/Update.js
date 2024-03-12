import React,{useState} from "react";
import {
  useWindowDimensions,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import * as Linking from 'expo-linking';
import { getUpdateLink } from '../Api/http'


export default function UpdateModal({ visible }) {
  const { width, height } = useWindowDimensions();
  const updateHandler = async() => {
    const response = await getUpdateLink();
    if(response.status === 200) {
      Linking.openURL(response.data.updateLink)
    }
    else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.kanachewata.drama')
    }
  };

  return (
    visible && (
      <View style={[styles.container, { height, width }]}>
        <View style={styles.updateContainer}>
          <Text style={{ marginLeft: 10, fontSize: 16 }}>
            New Update Avalible
          </Text>
          <Button style={styles.btn} onPress={updateHandler}
           activeOpacity={0.7}
          >
            <Text style={styles.btnText}>
                Update
            </Text>
           </Button>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  updateContainer: {
    height: 200,
    width: 300,
    backgroundColor: 'blue',
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    color: '#fff',
    },
    btn: {
        marginTop: 20,
        width: "50%",
        backgroundColor: '#2098AE',
        borderRadius: 10,
        },
});
