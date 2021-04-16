import * as React from "react";

import { Provider } from "react-redux";
import { createStore } from "@reduxjs/toolkit";
import { ReduxActions, ReduxState, rootReducer } from "../store";
import * as immer from "immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { responsiveFontSizes, ThemeProvider, CssBaseline } from "@material-ui/core";
import metamindTheme from "../theme/theme";
import moment from "moment";
import "moment/locale/fi";
import "moment/locale/en-gb";
import strings from "../localization/strings";
import EditorScreen from "./screens/home/editor-screen";
import AccessTokenRefresh from "./containers/access-token-refresh";

/**
 * Initialize Redux store
 */
const store = createStore<ReduxState, ReduxActions, any, any>(rootReducer);

/**
 * Material UI automated responsive font sizes
 */
const theme = responsiveFontSizes(metamindTheme);

/**
 * App component
 */
const App: React.FC = () => {
  React.useEffect(() => {
    moment.locale(strings.getLanguage());
    immer.enableAllPlugins();
  }, []);

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <Provider store={ store }>
        <AccessTokenRefresh> 
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={ EditorScreen } />
            </Switch>
          </BrowserRouter>
        </AccessTokenRefresh> 
      </Provider>
    </ThemeProvider>
  );
}

export default App;
