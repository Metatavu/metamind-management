import Api from "metamind-client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { AppAction } from "./actions";
import App from "./components/App";
import { processAction } from "./reducers/index";
import registerServiceWorker from "./registerServiceWorker";
import { IStoreState } from "./types/index";

const store = createStore<IStoreState, AppAction, any, any>(processAction, {
  authenticated: false,
  autolayout: true,
  intents: [],
  knots: [],

});

Api.configure(process.env.REACT_APP_API_BASE_PATH || "");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
