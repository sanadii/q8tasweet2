import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';
import { createStateSyncMiddleware, initMessageListener, initStateWithPrevTab } from 'redux-state-sync';
import { setupListeners } from './listeners'; // Import the listeners setup
import { getElections, getCategories } from './actions'; // Import your action creators

// Create middlewares
const sagaMiddleware = createSagaMiddleware();
const listenerMiddleware = createListenerMiddleware();

// Set up additional listeners
setupListeners(listenerMiddleware);

// Configure middlewares
const middlewares = [
  sagaMiddleware,
  listenerMiddleware.middleware,
  createStateSyncMiddleware()
];

export function configureAppStore(initialState) {
  // Create the Redux store with rootReducer, initial state, and middleware
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      // getDefaultMiddleware().concat(middlewares)
      getDefaultMiddleware().prepend(middlewares)

  });

  // Run the root saga
  sagaMiddleware.run(rootSaga);
  initStateWithPrevTab(store);
  initMessageListener(store);

  return store;
}
