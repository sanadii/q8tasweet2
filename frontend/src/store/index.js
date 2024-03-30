import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

import { createStateSyncMiddleware, initMessageListener, initStateWithPrevTab } from "redux-state-sync";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore(initialState) {

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middlewares)
      // applyMiddleware(createStateSyncMiddleware(...middlewares))
    ),
  );
  sagaMiddleware.run(rootSaga);
  initStateWithPrevTab(store);
  // initMessageListener(store);
  return store;
}