import React from 'react';
import './assets/scss/themes.scss';
import Route from './Routes';
import { WebSocketProvider } from 'utils/WebSocketContext';

function App() {
  return (
    <WebSocketProvider channel="Global">
      <Route />
    </WebSocketProvider>
  );
}

export default App;

