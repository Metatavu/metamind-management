import { AppAction } from '../actions';
import { StoreState } from '../types/index';
import { USER_LOGIN, USER_LOGOUT, AUTO_LAYOUT_TOGGLE, KNOTS_FOUND, KNOT_DELETED, KNOT_UPDATED, INTENTS_FOUND, INTENT_DELETED, INTENT_UPDATED, SEARCH } from '../constants/index';

export function processAction(state: StoreState, action: AppAction): StoreState {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, keycloak: action.keycloak, authenticated: action.authenticated};
    case USER_LOGOUT:
      return { ...state, keycloak: undefined, authenticated: false };
    case AUTO_LAYOUT_TOGGLE:
      return { ...state, autolayout: action.autolayout};
    case SEARCH:
    return { ...state, searchText: action.searchText};
    case KNOTS_FOUND:
      return { ...state, knots: (state.knots || []).concat(action.knots)};
    case KNOT_DELETED:
      return { ...state,  knots: (state.knots || []).filter((knot) => {return knot.id !== action.knotId})};
    case KNOT_UPDATED:
      const knots = state.knots || [];
      return { ...state, knots: knots.map((knot) => {
        if (action.knot.id && action.knot.id == knot.id) {
          return { ...knot, ...action.knot };
        } else {
          return knot;
        }
      })};
    case INTENTS_FOUND:
      return { ...state, intents: (state.intents || []).concat(action.intents)};
    case INTENT_DELETED:
      return { ...state,  intents: (state.intents || []).filter((intent) => {return intent.id !== action.intentId})};
    case INTENT_UPDATED:
      const intents = state.intents || [];
      return { ...state, intents: intents.map((intent) => {
        if (action.intent.id && action.intent.id == intent.id) {
          return { ...intent, ...action.intent };
        } else {
          return intent;
        }
      })};
  }
  return state;
}