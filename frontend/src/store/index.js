<<<<<<< HEAD
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore(initialState) {

  const store = createStore(
    rootReducer,
      initialState,
      composeEnhancers(
          applyMiddleware(...middlewares)
      ),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
=======
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';
import { createStateSyncMiddleware, initMessageListener, initStateWithPrevTab } from 'redux-state-sync';
import { setupListeners } from './listeners'; // Import the listeners setup

// Set up additional listeners
const sagaMiddleware = createSagaMiddleware();
const listenerMiddleware = createListenerMiddleware();

// Configure middlewares
const middlewares = [
  sagaMiddleware,
  // createStateSyncMiddleware()
];

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureAppStore(initialState) {

  const store = configureStore({
    // initialState: initialState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // getDefaultMiddleware().concat(middlewares)
      getDefaultMiddleware().prepend(middlewares)



  });
  sagaMiddleware.run(rootSaga);
  initStateWithPrevTab(store);

  // New
  initMessageListener(store);
  return store;
}
>>>>>>> sanad
