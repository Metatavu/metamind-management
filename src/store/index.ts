import { combineReducers } from "redux";
import { AuthAction } from "../actions/auth";
import { BotAction } from "../actions/bot";
import { StoryAction } from "../actions/story";
import { authReducer } from "../reducers/auth";
import { botReducer } from "../reducers/bot";
import { storyReducer } from "../reducers/story";

/**
 * Root reducer that wraps all Redux reducers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  story: storyReducer,
  bot: botReducer
});

/**
 * Type for Redux state 
 */
export type ReduxState = ReturnType<typeof rootReducer>;

/**
 * Union type for Redux actions
 */
export type ReduxActions = AuthAction | StoryAction | BotAction;
