import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import 'react-native-gesture-handler';
import React from 'react';
import Routes from './routes';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider } from 'react-redux';

import store from './store';

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#646464',
      accent: '#F2BB16',
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Routes />
      </PaperProvider>
    </Provider>
  );
}
