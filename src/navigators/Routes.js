import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import _routes from '../configs/routes';
import ScreenNameEnum from '../configs/screenName';
const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible:false,
        headerShadowVisible:false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      {_routes?.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          options={{headerShown: screen.name == ScreenNameEnum.SELECTED_CATEGORY ||  screen.name == ScreenNameEnum.TRAINING ? true :false}}
          component={screen.Component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default Routes;
