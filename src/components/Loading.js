import { StyleSheet, Text, View, Modal, ActivityIndicator } from 'react-native'
import React from 'react'
import COLORS from '../styles/colors'

const Loading = ({ visible }) => {
  return (
    <Modal
      transparent
      visible={visible}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <ActivityIndicator size={'small'} color={COLORS.primary}/>
      </View>
    </Modal>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)'
  }
})