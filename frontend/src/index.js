import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import { configureStore } from "./store";
=======
import { configureAppStore } from "./store";
>>>>>>> sanad
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<<<<<<< HEAD
  <Provider store={configureStore({})}>
=======
  <Provider store={configureAppStore({})}>
>>>>>>> sanad
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();