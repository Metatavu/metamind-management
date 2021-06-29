import { combineReducers } from "redux";
import { AuthAction } from "../actions/auth";
import { LocaleAction } from "../actions/locale";
import { authReducer } from "../reducers/auth";
import { localeReducer } from "../reducers/locale";

/**
 * Root reducer that wraps all Redux reducers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  locale: localeReducer
});

export type ReduxState = ReturnType<typeof rootReducer>;

/**
 * Union type for Redux actions
 */
export type ReduxActions = AuthAction | LocaleAction;
