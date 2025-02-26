import { StyleSheet } from 'react-native';
import FONTS from './fonts';
import COLORS from './colors';
const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleTxt: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.secondary,
    marginTop: 10
  },
  heading: {
    fontFamily: FONTS.bold,
    fontSize: 40,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 10
  },
  centerAlign: {
    textAlign: 'center',
  },
  rightAlign: {
    textAlign: 'center',
  },
  leftAlign: {
    textAlign: 'center',
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backTxtStyle: {
    fontSize: 25,
    fontFamily: FONTS.Biryanibold,
    color: COLORS.whiteColor
  },
  cardShadow: {
    // backgroundColor:'white',
    borderRadius: 10,
    shadowColor: "#FFFFFF",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,

elevation: 24,
  }
});
export default commonStyles;
