import React from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      <AppNavigator />
      <Toast />
    </GestureHandlerRootView>
  );
};

export default App;
