import { combineReducers } from "redux";
import { AuthAction } from "../actions/auth";
import { LocaleAction } from "../actions/locale";
import { authReducer } from "../reducers/auth";
import { localeReducer } from "../reducers/locale";
import { StoryAction } from "../actions/story";
import { storyReducer } from "../reducers/story";

/**
 * Root reducer that wraps all Redux reducers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  locale: localeReducer,
  story: storyReducer,
});

/**
 * Type for Redux state 
 */
export type ReduxState = ReturnType<typeof rootReducer>;

/**
 * Union type for Redux actions
 */
export type ReduxActions = AuthAction | LocaleAction | StoryAction;