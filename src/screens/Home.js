import {
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation-locker';
import {imagePath} from '../configs/imagePath';
import CustomBtn from '../components/CustomBtn';
import {verticalScale} from '../styles/responsiveLayoute';
import ScreenNameEnum from '../configs/screenName';
import {navigate} from '../navigators/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = props => {
  const [initialState, setInitialState] = useState('');
  useEffect(() => {
    setInitialState(Orientation.getInitialOrientation());
  }, [initialState]);

  // console.log('initial state',initialState);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const saveImageDetails = async imageDetails => {
    try {
      await AsyncStorage.setItem('imageDetails', JSON.stringify(imageDetails));
    } catch (error) {
      console.error('Error saving image details:', error);
    }
  };

  const chooseImage = () => {
    ImagePicker.openPicker({
      // width: 300,
      width: windowWidth,
      height: windowHeight,
      // height: 400,
      cropping: false,
      multiple: false,
      mediaType: 'photo',
    })
      .then(image => {
        // console.log('Response of select from gallery - ', image);
        props.navigation.navigate(ScreenNameEnum.EDIT_IMAGE, {
          imageDetails: image,
        });
        saveImageDetails(image);
      })
      .catch(e => {
        // console.log('Catch from gallery image picker', e);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      // width: 300,
      // height: 400,
      width: windowWidth,
      height: windowHeight,
      cropping: false,
      mediaType: 'photo',
    })
      .then(image => {
        // console.log('Response of select from camera - ', image);
        props.navigation.navigate(ScreenNameEnum.EDIT_IMAGE, {
          imageDetails: image,
        });
        saveImageDetails(image);
      })
      .catch(e => {
        // console.log('Catch from camera image picker', e);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchImageDetails = async () => {
        await AsyncStorage.removeItem('imageDetails');
        await AsyncStorage.removeItem('images');
        await AsyncStorage.removeItem('images')
      };

      fetchImageDetails();
    }, []),
  );


  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.ImageStyle}
        source={require('../assets/images/photoBg.jpg')}
        resizeMode={'stretch'}>
        <Image source={imagePath.logo} style={styles.logoStyle} />
        <CustomBtn
          onPress={() => openCamera()}
          btnStyle={{marginVertical: verticalScale(20), width: '70%'}}
          icon={imagePath.camera}
          title={'Camera'}
        />
        <CustomBtn
          onPress={() => chooseImage()}
          btnStyle={{width: '70%'}}
          icon={imagePath.gallery}
          title={'Gallery'}
        />
        <CustomBtn
          onPress={() => navigate(ScreenNameEnum.TRAINING)}
          btnStyle={{width: '70%', marginTop: verticalScale(20)}}
          icon={imagePath.training}
          title={'Training'}
        />
      </ImageBackground>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageStyle: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    height: 213,
    width: 184,
    marginBottom: verticalScale(40),
  },
});
