import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import COLORS from '../styles/colors';

const ImageWithLoader = ({ source, style,resizeMode }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={style}>
      {loading &&
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      }
      <FastImage
        resizeMode={resizeMode}
        source={source}
        style={style}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

export default ImageWithLoader;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary, // Semi-transparent background for overlay effect
  },
});
