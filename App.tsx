import React from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
};

export default App;
