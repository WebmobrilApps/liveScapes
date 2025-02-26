import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '../styles/colors'
import FONTS from '../styles/fonts'

const CustomBtn = ({title,btnStyle,onPress,titleStyle,icon}) => {
  return (
    <TouchableOpacity onPress={onPress}
    style={[styles.btnContainer,btnStyle]}>
        <Image source={icon} style={styles.iconStyle}/>
        <Text style={[styles.title,titleStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomBtn

const styles = StyleSheet.create({
    btnContainer:{
        backgroundColor:COLORS.whiteColor,
        height:65,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        width:'100%',
        flexDirection:'row'
    },title:{
        fontSize:20,
        fontFamily:FONTS.InterMedium,
        color:COLORS.primary,
    },
    iconStyle:{
        height:30,
        width:30,
        marginRight:10,
        tintColor:COLORS.primary
    }
})