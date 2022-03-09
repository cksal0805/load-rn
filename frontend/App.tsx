import React from 'react';
import {Provider} from 'react-redux';
import store from './src/stores';
import AppInner from './AppInner';

function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
