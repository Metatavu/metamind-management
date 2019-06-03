import { AppAction } from "../actions";
import * as constants from "../constants/index";
import { IStoreState } from "../types/index";

export function processAction(state: IStoreState, action: AppAction): IStoreState {
  switch (action.type) {
    case constants.USER_LOGIN:
      return { ...state, keycloak: action.keycloak, authenticated: action.authenticated};
    case constants.USER_LOGOUT:
      return { ...state, keycloak: undefined, authenticated: false };
    case constants.AUTO_LAYOUT_TOGGLE:
      return { ...state, autolayout: action.autolayout};
    case constants.SEARCH:
    return { ...state, searchText: action.searchText};
    case constants.KNOTS_FOUND:
      return { ...state, knots: (state.knots || []).concat(action.knots)};
    case constants.KNOT_DELETED:
      return { ...state,  knots: (state.knots || []).filter((knot) =>  knot.id !== action.knotId)};
    case constants.KNOT_UPDATED:
      const knots = state.knots || [];
      return { ...state, knots: knots.map((knot) => {
        if (action.knot.id && action.knot.id === knot.id) {
          return { ...knot, ...action.knot };
        } else {
          return knot;
        }
      })};
    case constants.INTENTS_FOUND:
      return { ...state, intents: (state.intents || []).concat(action.intents)};
    case constants.INTENT_DELETED:
      return { ...state,  intents: (state.intents || []).filter((intent) => intent.id !== action.intentId)};
    case constants.INTENT_UPDATED:
      const intents = state.intents || [];
      return { ...state, intents: intents.map((intent) => {
        if (action.intent.id && action.intent.id === intent.id) {
          return { ...intent, ...action.intent };
        } else {
          return intent;
        }
      })};
    case constants.GET_KNOT_POSITIONS:
      return {...state, knotPositions: action.knotPositions};
    case constants.SET_KNOT_POSITIONS:
        return {...state, knotPositions: action.knotPositions};
  }
  return state;
}
