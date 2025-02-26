/* eslint-disable react-hooks/exhaustive-deps */
import { navigationRef } from './NavigationService';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './Routes';

const AppNavigator = () => {

  return (
    <NavigationContainer
      ref={navigationRef}>
      <Routes />
    </NavigationContainer>
  );
};
export default AppNavigator;
