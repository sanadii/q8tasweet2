import React from 'react';
import Route from './Routes';
import './assets/scss/themes.scss';
import { WebSocketProvider } from 'shared/utils';

function App() {
  return (
    <WebSocketProvider channel="Global">
      <Route />
    </WebSocketProvider>
  );
}

export default App;

