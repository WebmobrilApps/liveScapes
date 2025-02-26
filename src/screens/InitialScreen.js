import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Orientation from 'react-native-orientation-locker'
import { imagePath } from '../configs/imagePath'
import ScreenNameEnum from '../configs/screenName'
import AsyncStorage from '@react-native-async-storage/async-storage'

const InitialScreen = (props) => {
  useEffect(() => {
    Orientation.lockToPortrait();
    setTimeout(() => {
      checkToken()
    }, 2000);
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('onBoard');
    // console.log('here is the token',token);
    
    if (token) {
      props.navigation.navigate(ScreenNameEnum.HOME_SCREEN);
    } else {
      props.navigation.navigate(ScreenNameEnum.WELCOME_SCREEN);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
      source={imagePath.bg}
      style={styles.imageStyle}
      >
        <Image source={imagePath.logo} style={styles.logoStyle}/>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default InitialScreen

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    imageStyle:{
        height:'100%',
        width:'100%',
        resizeMode:'cover',
        justifyContent:'center',
        alignItems:'center'
    },logoStyle:{
      width:184,
      width:213,
      resizeMode:'contain'
    }
})