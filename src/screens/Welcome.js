import {
  BackHandler,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import React, { useRef, useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imagePath } from '../configs/imagePath';
import COLORS from '../styles/colors';
import FONTS from '../styles/fonts';
import ScreenNameEnum from '../configs/screenName';
import { moderateScale, verticalScale } from '../styles/responsiveLayoute';

const { width } = Dimensions.get('window');

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onBoard',
};

const Welcome = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();

  const introData = [
    {
      id: 1,
      title: 'Capture the Perfect Shot',
      subTitle: 'Snap a photo and start transforming your space\n with Livescapes.',
      image: imagePath.intro1,
    },
    {
      id: 2,
      title: 'Choose Your Ideal Furniture',
      subTitle: 'Select from a wide range of furniture to design your dream room with Livescapes.',
      image: imagePath.intro2,
    },
    {
      id: 3,
      title: 'Bring Your Room to Life',
      subTitle: 'Customize and visualize your room with our easy-to-use\n decoration tools.',
      image: imagePath.intro3,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();

      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        Orientation.unlockAllOrientations();
      };
    }, [])
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const PaginationDots = () => (
    <View style={styles.paginationContainer}>
      <View style={styles.paginationDots}>
        {introData.map((_, i) => (
          <View
            key={i}
            style={i === currentIndex ? styles.ActiveDotStyle :styles.dotStyle}
          />
        ))}
      </View>
    </View>
  );

  const _renderItem = ({ item }) => {
    return (
      <ImageBackground
        style={styles.ImageStyle}
        source={item.image}
        resizeMode="stretch"
      >
        <LinearGradient
          colors={['#002628', '#000000']}
          style={styles.introStyle}
        >
          <View style={{ padding: moderateScale(15), paddingBottom: Platform.select({ ios: moderateScale(10), android: moderateScale(20) }) }}>
            <Text style={styles.introHeading}>{item.title}</Text>
            <Text style={styles.introSubHeading}>{item.subTitle}</Text>
          </View>
          <View style = {{flexDirection:'row',flex:1,justifyContent:'flex-end',alignItems:'center',paddingHorizontal:moderateScale(25)}}>
          
          <TouchableOpacity
            accessible
            accessibilityLabel={currentIndex === introData.length - 1 ? "Start the app" : "Next slide"}
            style={styles.nextButton}
            onPress={currentIndex === introData.length - 1 ? handleDone : handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === introData.length - 1 ? "Let's Start" : 'Next'}
            </Text>
          </TouchableOpacity>
          </View>
          
        </LinearGradient>
      </ImageBackground>
    );
  };

  const handleNext = () => {
    if (flatListRef.current && currentIndex + 1 < introData.length) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleDone = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    navigation.navigate(ScreenNameEnum.HOME_SCREEN);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={introData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={_renderItem}
        keyExtractor={item => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      <PaginationDots />
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageStyle: {
    width: width,
    height: '100%',
  },
  introStyle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  introHeading: {
    fontFamily: FONTS.InterMedium,
    color: COLORS.whiteColor,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  introSubHeading: {
    fontSize: 12,
    fontFamily: FONTS.InterRegular,
    color: COLORS.whiteColor,
    textAlign: 'center',
  },
  dotStyle: {
    backgroundColor: COLORS.whiteColor,
    height: verticalScale(6),
    width: moderateScale(9),
    borderRadius: 20,
    marginHorizontal: moderateScale(5),
  },
  ActiveDotStyle: {
    backgroundColor: COLORS.primary,
    height: verticalScale(6),
    width: moderateScale(13),
    borderRadius: 20,
    marginHorizontal: moderateScale(5),
  },
  paginationContainer: {
    zIndex:1,
    position:'absolute',
    alignItems: 'center',
    // backgroundColor:'red'
    marginLeft:moderateScale(25),
    bottom:Platform.OS=='ios' ? verticalScale(55):verticalScale(35),
    left:moderateScale(20)
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    height: verticalScale(35),
    width: moderateScale(140),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: verticalScale(12),
    alignSelf: 'center',
    marginBottom: verticalScale(15),
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: FONTS.InterMedium,
    color: COLORS.primary,
  },
});
