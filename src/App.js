import codePush from 'react-native-code-push';
import AppScreen from '@src/components/AppScreen';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import React from 'react';
import 'react-native-console-time-polyfill';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from '@components/core/Toast/Toast';

const { store, persistor } = configureStore();
const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppScreen>
          <AppContainer />
          <Toast />
          <QrScanner />
        </AppScreen>
      </PersistGate>
    </Provider>
  );
};

export default codePush(codePushOptions)(App);
