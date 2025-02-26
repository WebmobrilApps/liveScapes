import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Orientation from 'react-native-orientation-locker';
import Gestures from 'react-native-easy-gestures';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';
import LinearGradient from 'react-native-linear-gradient';
import CustomBtn from '../components/CustomBtn';
import COLORS from '../styles/colors';
import {imagePath} from '../configs/imagePath';
import {goBack, navigate} from '../navigators/NavigationService';
import ScreenNameEnum from '../configs/screenName';
import WrapperContainer from '../components/WrapperContainer';
import FONTS from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditImage = props => {
  const route = useRoute();
  const routeImages = route?.params?.selectedImages;

  // console.log('routeImages', routeImages);

  const [image, setImage] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editImage1, setEditImage1] = useState(false);
  const [save, setSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPic, setSelectedPic] = useState([]);
  const [buttonKey, setButtonKey] = useState(false);
  const [closeButton, setCloseButton] = useState(true);
  const [fixImage, setFixImage] = useState(false);
  const ref = useRef();
  const [flipKey, setFlipKey] = useState(false);
  const [bottomFour, setBottomFour] = useState(false);
  const [positionFrame, setPositionFrame] = useState(false);

  const [data, setData] = useState([
    {image: imagePath.flip_photo, id: 1, name: 'Flip'},
    {image: imagePath.addIcon, id: 5, name: 'Add'},
  ]);

  const [Fullscreen, setFullscreen] = useState(false);

  const [imageArray, setImageArray] = useState([]);
  const [imageArray1, setImageArray1] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndex1, setSelectedIndex1] = useState(0);

  const [selectedItem, setSelectedItem] = useState(null);

  const [currentDeg, setCurrentDeg] = useState(0);
  const [initialState, setInitialState] = useState('');

  const [activeImage, setActiveImage] = useState('');
  const imageArrayRef = useRef(imageArray);

  useEffect(() => {
    imageArrayRef.current = imageArray;
    // clearImages();
    // console.log('imageArrayRef.current', imageArrayRef);
  }, [imageArray]);

  // console.log('initiiii', initialState);

  useFocusEffect(
    React.useCallback(() => {
      // console.log('Navigated to EditImage screen', routeImages);

      if (routeImages && routeImages.length > 0) {
        // console.log('Here are the new images', routeImages);
        chooseImage(routeImages);
        // Clear route params after use
        props.navigation.setParams({selectedImages: null});
      }

      const onBackPress = () => {
        goBack();
        clearImages();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [routeImages]),
  );

  // console.log('selectedPic------', selectedPic);

  const tap = Gesture.Tap().onStart(() => {
    // console.log('tap');
  });

  //flip code start
  let animatedValue = new Animated.Value(0);
  let currentValue = 0;

  animatedValue.addListener(({value}) => {
    currentValue = value;
  });

  // console.log('active image',activeImage);

  const flipAnimation = (item, index) => {
    // console.log('item=====>>>>>>>>>>', item.flip);
    if (item.flip) {
      if (currentValue >= 90) {
        Animated.spring(animatedValue, {
          toValue: 0,
          tension: 10,
          friction: 8,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(animatedValue, {
          toValue: 180,
          tension: 10,
          friction: 8,
          useNativeDriver: false,
        }).start();
      }
    }
  };
  const clearImages = async () => {
    try {
      // Remove only the 'images' key from AsyncStorage
      await AsyncStorage.removeItem('images');
      // console.log('Images key cleared successfully!');
    } catch (error) {
      console.error('Error clearing images key:', error);
    }
  };

  const saveImage = async imageObject => {
    try {
      // Get the current array from AsyncStorage
      const existingImages = await AsyncStorage.getItem('images');
      let imagesArray = existingImages ? JSON.parse(existingImages) : [];

      // Check if the image with the same 'id' already exists
      const existingIndex = imagesArray.findIndex(
        img => img.id === imageObject.id,
      );

      if (existingIndex > -1) {
        // Update the existing image
        // Directly update the image object in the array (no nested object keys like '0')
        imagesArray[existingIndex] = {...imageObject};
        // console.log(`Image with ID ${imageObject.id} updated.`);
      } else {
        // Add new image if not already present
        imagesArray.push(imageObject);
        // console.log(`Image with ID ${imageObject.id} added.`);
      }

      // Save updated array back to AsyncStorage
      await AsyncStorage.setItem('images', JSON.stringify(imagesArray));
      console.log('Updated images array:', imagesArray);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const deleteStoredImage = async imageId => {
    try {
      // Fetch existing images array from AsyncStorage
      const existingImages = await AsyncStorage.getItem('images');
      let imagesArray = existingImages ? JSON.parse(existingImages) : [];
      // console.log('existingImages', existingImages, imagesArray);

      // Remove the image object with the given id
      const updatedImagesArray = imagesArray.filter(image => {
        // console.log('imageimageimageimageimage', image?.id, imageId?.id);
        return image?.id !== imageId?.id; // Return the filter condition
      });

      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem('images', JSON.stringify(updatedImagesArray));
      setImageArray(updatedImagesArray);
      // console.log('Image deleted successfully!', updatedImagesArray);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleImageSelect = (item, index) => {
    // console.log('item in handle select', item);

    setSelectedIndex(index);
    setActiveImage(item.id);

    // Create a copy of the image array
    const updatedImageArray = [...imageArray];

    // Extract the selected image
    const selectedImage = {...updatedImageArray[index]};

    // Update the position of the selected image (e.g., new x, y)
    selectedImage.position = {
      x: item.position.x, // Replace newXValue with your desired new X position
      y: item.position.y, // Replace newYValue with your desired new Y position
    };
    // console.log('selectedImage.position', selectedImage);
    selectedImage.scale = item.scale;
    // Remove the selected image from its original index
    updatedImageArray.splice(index, 1);

    // Push the updated image to the end of the array (to bring it to the top)
    updatedImageArray.push(selectedImage);

    // Update the image array state to reflect the reordering and new position
    setImageArray(updatedImageArray);
    saveImage(selectedImage);
  };

  const setInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const rotateYAnimatedStyle = {
    // transform: [{rotateY: setInterpolate}],
    transform: [{scaleX: -1}],
  };
  const [imgHeight, setImgHeight] = useState(1);
  const [imgWidth, setImgWidth] = useState(1);
  useFocusEffect(
    React.useCallback(() => {
      const fetchImageDetails = async () => {
        try {
          const storedImageDetails = await AsyncStorage.getItem('imageDetails');
          if (storedImageDetails) {
            const parsedDetails = JSON.parse(storedImageDetails);
            setImage(parsedDetails.path);
            setImgHeight(parsedDetails.height);
            setImgWidth(parsedDetails.width);
          }
        } catch (error) {
          console.error('Error retrieving image details:', error);
        }
      };

      fetchImageDetails();
    }, []),
  );

  const DeleteImage = (item, index) => {
    // Filter the imageArray to remove the selected image
    const temp = imageArray.filter(element => element.id !== item.id);

    setImageArray(temp);
    // console.log('Updated imageArray:', temp, item);
    deleteStoredImage(item);
    // Filter the routeImages to remove the selected image
    // const updatedRouteImages = routeImages.filter(element => {
    //   console.log('Comparing:', element.uri, 'with', item.file);
    //   return element.uri !== item.file;
    // });

    // console.log('Updated routeImages:', updatedRouteImages);

    // Update the route params with the new array
    // props.navigation.setParams({selectedImages: updatedRouteImages});

    // Handle UI states when the array is empty
    if (temp.length === 0) {
      setButtonKey(false);
      setBottomFour(false);
      setSave(false);
      setEditImage1(false);
      setFlipKey(false);
      setCloseButton(false);
    }
  };

  const generateUniqueId = () => `${Date.now()}-${Math.random()}`;

  const chooseImage = async images => {
    // Log the new images being passed in
    // console.log('Newly selected images:', images);

    // Retrieve the existing images array from AsyncStorage
    const existingImages = await AsyncStorage.getItem('images');
    let imagesArray = existingImages ? JSON.parse(existingImages) : [];

    // Map new images into the desired format and filter out duplicates
    const newImages = images
      .filter(
        img => !imagesArray.some(existingImg => existingImg.file === img.uri),
      )
      .map(img => ({
        file: img.uri, // Make sure the URI is correctly used as 'file'
        id: generateUniqueId(),
        position: {x: 0, y: 0}, // Initialize position
        scale: 1,
        rotate: 0,
        flip: false,
      }));

    // Combine the old images with the new ones
    const combinedImages = [...imagesArray, ...newImages];

    // Log the old images and the final combined images
    // console.log('Old images (before adding new ones):', imagesArray);
    // console.log(
    //   'Final combined images (after adding new ones):',
    //   combinedImages,
    // );

    // Update the state with the combined images
    setImageArray(combinedImages);

    // Update other states based on image count
    setImageArray1(combinedImages.length > 1);
    if (combinedImages.length > 0) {
      setButtonKey(true);
      setBottomFour(true);
      setSave(true);
      setFixImage(false);
      setEditImage1(true);
    }
    setCloseButton(true);
  };

  const clearEditImage = () => {
    Alert.alert(
      'LiveScapes',
      'Are you sure you want to delete picture from screen?',
      [
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => clearEditImage1()},
      ],
    );
  };

  const clearEditImage1 = () => {
    setEditImage('');
    clearImages();
    // setCloseButton(false);
    setBottomFour(false);
    setFixImage(true);
    setSelectedPic([]);
    setImageArray1(false);
    setSave(false);
    setEditImage1(false);
    setSelectedItem(null);
    setButtonKey(false);
    setFlipKey(false);
    setImageArray([]);
  };

  // console.log('Image Array==>', imageArray);

  async function hasAndroidPermission() {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  async function savePicture() {
    setIsLoading(true);
    setSelectedIndex(10);
    setPositionFrame(true);
    setImageArray1(false);
    setSave(false);
    setEditImage1(false);
    setBottomFour(false);
    setTimeout(() => {
      ref.current.capture().then(uri => {
        savePicture1(uri);
      });
    }, 1000);
    // return
  }

  const savePicture1 = async res => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    CameraRoll.save(res, {type: 'photo', album: 'DCIM/Camera'}).then(() => {
      // console.log('Success', 'Photo added to camera roll!');
      Orientation.lockToPortrait();
      Alert.alert('LiveScapes', 'Photo save successfully in your Gallery', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      setIsLoading(false);
      navigate(ScreenNameEnum.HOME_SCREEN);
    });
    // .catch(err => console.log('err:', err));
    // console.log('video savedddd===9999==>');
  };

  useEffect(() => {
    setInitialState(Orientation.getInitialOrientation());
    // console.log('OrientationOrientationOrientation', initialState);
  }, [initialState]);

  // console.log('fulllscreen', Fullscreen);

  const temparray = [...imageArray];

  const FullscreenToggle = () => {
    // Orientation.unlockAllOrientations()
    if (Fullscreen) {
      // console.log('Fullscreen mode in if', Fullscreen);
      Orientation.lockToPortrait();
      setFullscreen(false);
    } else {
      // console.log('Fullscreen mode in else', Fullscreen);
      Orientation.lockToLandscape();
      setFullscreen(true);
      // setFullScreen1(true);
    }
  };

  const handlePositionChange = (item, styles, index) => {



    handleImageSelect(item, index);
    const {left, top, transform} = styles;
    const scaleTransform = transform.find(t => t.scale !== undefined);
    const scale = scaleTransform ? scaleTransform.scale : item.scale;

    // console.log('Extracted scale:', scale);
    setImageArray(prev =>
      prev.map(img =>
        img.id === item.id
          ? {...img, position: {x: left, y: top}, scale: scale || img.scale}
          : img,
      ),
    );
  };

  // console.log('image array is logged');

  const handleFlipPress = (item, index) => {
    // Find the index of the image with the active ID
    const imageIndex = imageArray.findIndex(img => img.id === activeImage);
    // console.log('image index', imageIndex);

    // If the active image exists in the array
    if (imageIndex !== -1) {
      // console.log('image index1', imageIndex);
      // Update the flip state of the active image
      setImageArray(prevImages =>
        prevImages.map((img, index) => {
          // console.log('indeimgimgimgimgx', img);

          if (index === imageIndex) {
            img.flip = !img.flip; // Toggle the flip state
          }
          return img;
        }),
      );
      // console.log('Active image:', imageArray[imageIndex], activeImage);
      saveImage(imageArray[imageIndex]);
      // Trigger the flip animation
      flipAnimation(imageArray[imageIndex], imageIndex);
    }
  };

  return (
    <WrapperContainer>
      <GestureHandlerRootView>
        <GestureDetector gesture={tap}>
          <SafeAreaView style={styles.container}>
            {editImage1 ? (
              <TouchableOpacity
                onPress={() => clearEditImage()}
                style={[styles.closeView, {marginLeft: 15}]}>
                <Image
                  style={{height: 20, width: 20}}
                  source={imagePath.closeIcon}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            ) : (
              <>
                {!buttonKey && (
                  <TouchableOpacity
                    onPress={() => {
                      navigate(ScreenNameEnum.HOME_SCREEN),
                        Orientation.lockToPortrait();
                    }}
                    style={styles.closeView}>
                    <Image
                      style={{height: 15, width: 15, left: -1}}
                      source={imagePath.leftArrow}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}

            {save ? (
              <View style={styles.SaveMainView}>
                <TouchableOpacity
                  onPress={() => savePicture()}
                  style={styles.SaveButtonStyle}>
                  <Image
                    style={{height: 18, width: 18}}
                    source={imagePath.SavePhoto}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: '500',
                      fontSize: 14,
                      color: '#fff',
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <ViewShot
            style={{justifyContent:'center',alignItems:'center'}}
              ref={ref}
              options={{fileName: 'LiveScapes', format: 'jpg', quality: 1}}>
              <ImageBackground
                style={[
                  !Fullscreen?{
                  width: '100%',
                  alignSelf: 'stretch',
                  aspectRatio: imgWidth / imgHeight,
                  justifyContent: 'center',
                }:
                {
                  height: '100%',
                  alignSelf: 'stretch',
                  aspectRatio: imgHeight/imgWidth ,
                  justifyContent: 'center',
                }
                ]}
                source={{uri: image}}
                resizeMode={'contain'}>
                {!fixImage ? (
                  <View style={{position: 'relative'}}>
                    <Animated.View style={styles.MainView}>
                      {imageArray.map((item, index) => (
                        // console.log('itemitemitemitem', item?.scale),
                        <Gestures
                          key={item?.id}
                          rotate={`${currentDeg}deg`}
                          scale={item?.scale}
                          draggable={true}
                          rotatable={true}
                          scalable={{min: 1, max: 5}}
                          style={{
                            position: 'absolute',
                            left: item.position?.x,
                            top: item.position?.y,
                          }}
                          onChange={(event, styles) => {
                            // console.log('Styles from Gestures:', styles),
                            handlePositionChange(item, styles, index);
                          }}
                          >
                          {selectedIndex === index && (
                            <TouchableOpacity
                              style={styles.imageCloseButton}
                              onPress={() => DeleteImage(item, index)}>
                              <Image
                                source={imagePath.closeIcon}
                                style={styles.closeImage}
                              />
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={() => {handleImageSelect(item, index)}}>
                            <ImageBackground
                              resizeMode="contain"
                              source={
                                selectedIndex === index ? imagePath.flick : null
                              }
                              style={[
                                styles.imageBackground,
                                {zIndex: index === selectedIndex ? 1 : 0}, // Apply zIndex dynamically
                              ]}
                              imageStyle={{
                                tintColor: !positionFrame
                                  ? null
                                  : 'transparent',
                              }}>
                              <Animated.View
                                style={[
                                  item?.flip && rotateYAnimatedStyle,
                                  {},
                                ]}>
                                <Image
                                  source={{uri: item?.file}}
                                  style={[
                                    {
                                      height: 150 * item?.scale,
                                      width: 150 * item?.scale,
                                      margin: 10,
                                    },
                                  ]}
                                  resizeMode="contain"
                                />
                              </Animated.View>
                            </ImageBackground>
                          </TouchableOpacity>
                        </Gestures>
                      ))}
                    </Animated.View>
                  </View>
                ) : null}
              </ImageBackground>
            </ViewShot>

            {!buttonKey ? (
              <CustomBtn
                title={'Upload Images'}
                icon={imagePath.gallery}
                onPress={() => navigate(ScreenNameEnum.SELECTED_CATEGORY)}
                btnStyle={{
                  position: 'absolute',
                  bottom: 20,
                  alignSelf: 'center',
                  width: '80%',
                }}
              />
            ) : bottomFour ? (
              <LinearGradient
                colors={['rgba(0, 96, 101, 1)', 'rgba(0, 41, 44, 1)']}
                style={[
                  styles.ButtonView,
                  {
                    height: Fullscreen ? '85%' : 94,
                    width: Fullscreen ? 'auto' : '100%',
                    flexDirection: Fullscreen ? 'column' : 'row',
                    right: Fullscreen ? 10 : null,
                  },
                ]}>
                {data.map((item, index) => {
                  return (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: Fullscreen ? 'row' : 'column',
                      }}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor:
                              selectedIndex1 == index
                                ? COLORS.primary
                                : '#424E56',

                            height: Fullscreen ? 40 : 50,
                            width: Fullscreen ? 40 : 50,
                            borderRadius: Fullscreen ? 20 : 25,
                          },
                        ]}
                        onPress={() => {
                          // handleFlip(text);
                          // console.log(
                          //   'iimageArrayimageArrayimageArrayndex',
                          //   imageArray[imageIndex],
                          // );

                          setSelectedIndex1(index),
                            item.name == 'Flip'
                              ? handleFlipPress(item, index)
                              : item.name == 'Add'
                              ? navigate(ScreenNameEnum.SELECTED_CATEGORY)
                              : null;
                          // setSelectedIndex1(index),
                          //   item.name == 'Flip'
                          //     ? handleFlipPress(item, index)
                          //     : item.name == 'Add'
                          //     ? navigate(ScreenNameEnum.SELECTED_CATEGORY, {
                          //         selectedImage: imageArray,
                          //       })
                          //     : null;
                        }}>
                        <Image
                          style={[
                            styles.iconStyle,
                            {
                              height: Fullscreen ? 20 : 30,
                              width: Fullscreen ? 20 : 30,
                            },
                          ]}
                          source={item.image}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.ActionButtonText]}>
                        {!Fullscreen ? item.name : null}
                      </Text>
                    </View>
                  );
                })}
              </LinearGradient>
            ) : null}
            <ActivityIndicator animating={isLoading} size={'large'} />
            {/* {!bottomFour ? (
              <TouchableOpacity
                onPress={() => FullscreenToggle()}
                style={{position: 'absolute', bottom: 40, right: 20}}>
                <Image
                  source={imagePath.orientation}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    tintColor: 'white',
                  }}
                />
              </TouchableOpacity>
            ) : null} */}
          </SafeAreaView>
        </GestureDetector>
      </GestureHandlerRootView>
    </WrapperContainer>
  );
};

export default EditImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent:'center',alignItems:'center'
  },
  ImageStyle: {
    height: '100%',
    width: '100%',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  ButtonView: {
    backgroundColor: COLORS.black1,
    height: 94,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 15,
    justifyContent: 'space-around',
  },
  MainView: {
    borderColor: 'white',
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'flex-start',
  },
  actionButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#424E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ActionButtonText: {
    fontFamily: FONTS.InterMedium,
    fontSize: 13,
    lineHeight: 12.1,
    color: COLORS.whiteColor,
    alignSelf: 'center',
    marginTop: 5,
  },
  iconStyle: {
    height: 30,
    width: 30,
    tintColor: 'white',
  },
  SaveButtonStyle: {
    width: 100,
    padding: 10,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  SaveMainView: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: '1%',
    right: 10,
    zIndex: 9999,
  },
  closeView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 999,
  },
  imageCloseButton: {
    height: 20,
    marginBottom: -15,
    marginLeft: 5,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    zIndex: 9999,
    backgroundColor: 'white',
  },
  closeImage: {
    height: 15,
    width: 15,
    tintColor: 'black',
    resizeMode: 'contain',
  },
});

