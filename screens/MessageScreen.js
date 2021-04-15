import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform, Linking, TextInput, ImageBackground, Image } from 'react-native';
import {Card, Icon, ListItem, Tile, Button} from 'react-native-elements';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import firebase from 'firebase';
import db from '../config.js';
import AppHeader from '../components/AppHeader.js';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function MessageNotification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    getLocation()
    getLocationLink();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      
      sms(phone_number)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);



    let phone_number = "";

    return (
        <View>

            <AppHeader/>

            <ImageBackground source={require('../assets/calmify-bg.png')} style={{resizeMode: "cover", height: "100%"}}>

                <Image source={require('../assets/message_loved.png')} style={{width: 100, height: 100, alignSelf: 'center', marginTop: 5, marginBottom: 15}} />
                <Text style={{fontSize: 20, color: 'white', backgroundColor: '#5EB2F4', borderRadius: 10, width:220, height:30, textAlign: 'center', alignSelf: 'center'}}>Message a Loved One</Text>
                <Text style={{fontSize: 17, color: '#1175fa', textAlign: 'center', alignSelf: 'center', marginTop: 13, marginLeft: 15, marginRight: 15}}>If you need are in need of immediate help{'\n'}from a closed one</Text>
                <Text style={{fontSize: 18, color: '#ffffff',backgroundColor: '#9ade7d', borderRadius: 20, textAlign: 'center', alignSelf: 'center', width: 280, marginTop: 13, marginLeft: 10, marginRight: 10, height: 50 }}>Click below to start emergency messaging</Text>
                
                <View
                    style={{
                        borderBottomColor: '#3F91FF00',
                        borderBottomWidth: 2,
                        width: 380,
                        alignSelf: "center",
                        marginTop: 23
                    }}
                />
                
                <Button
                    title="Initialize Message Notification"
                    icon={
                      <Icon
                        name="check-circle"
                        type="font-awesome-5"
                        size={20}
                        color="white"
                        style={{marginRight: 10}}
                      />
                    }
                    buttonStyle={{backgroundColor: '#5EB2F4', width: 340, alignSelf: 'center', borderRadius: 7}}
                    containerStyle={{ width: 340, alignSelf: 'center', borderRadius: 7}}
                    titleStyle={{fontSize: 20}}
                    raised
                    onPress={async () => {
                    await schedulePushNotification();
                    }}
                />

                <View
                  style={{
                  borderBottomColor: '#3F91FF',
                  borderBottomWidth: 2,
                  width: 400,
                  alignSelf: "center",
                  marginTop: 23
                  }}
                />

                <Image source={require('../assets/info-calmify.png')} style={{width: 288, height: 243, alignSelf: 'center'}} />

            </ImageBackground>

        </View>
    );
}
    


  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Do you need immediate help?",
        body: 'Click here to 💬 Message your loved ones',
        autoDismiss: false,
        sticky: true,
        priority: "high"
      },
      trigger: null
    });
  }

  let locationLatitude = "null";
  let locationLongitude = "null";

  async function getLocation() {
    let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation});
      locationLatitude = location.coords.latitude.toString();
      locationLongitude =  location.coords.longitude.toString()
  }

  var location_link = "null"

  async function getLocationLink() {
    location_link = "https://www.google.com/maps?q=" + locationLatitude + ',' + locationLongitude
  }

  function sms(contact){
    const isAvailable =  SMS.isAvailableAsync();
    if (isAvailable) {
      
    const { result } =  SMS.sendSMSAsync(
      contact,
      "I need help!\nIt's urgent.\nPlease contact me immediately.\nThis is my location- "+ location_link
      );
    }
  }

  async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}