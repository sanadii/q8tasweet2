// App.js
import React from 'react';
import Route from './Routes';
import './assets/scss/themes.scss';
import { WebSocketProvider } from './WebSocketProvider';

function App() {
  return (
    // <WebSocketProvider>
      <Route />
    // </WebSocketProvider>
  );
}

export default App;
