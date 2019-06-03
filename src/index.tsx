import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';

import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import { processAction } from './reducers/index';
import { IStoreState } from './types/index';
import { AppAction } from './actions';
import { Provider } from 'react-redux';
import Api from "metamind-client";

const store = createStore<IStoreState, AppAction, any, any>(processAction, {
  authenticated: false,
  autolayout: true,
  knots: [],
  intents: []
});

Api.configure(process.env.REACT_APP_API_BASE_PATH || "");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
