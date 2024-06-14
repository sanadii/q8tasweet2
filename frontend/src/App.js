import React from 'react';
import Route from './Routes';
import './assets/scss/themes.scss';
<<<<<<< HEAD
import { WebSocketProvider } from 'utils/WebSocketContext';
=======
import { WebSocketProvider } from 'shared/utils';
>>>>>>> sanad

function App() {
  return (
    <WebSocketProvider channel="Global">
      <Route />
    </WebSocketProvider>
  );
}

export default App;

