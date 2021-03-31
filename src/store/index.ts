import { combineReducers } from "redux";
import { AuthAction } from "../actions/auth";
import { authReducer } from "../reducers/auth";

/**
 * Root reducer that wraps all Redux reducers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
});

export type ReduxState = ReturnType<typeof rootReducer>;

/**
 * Union type for Redux actions
 */
export type ReduxActions = AuthAction;
