import * as constants from '../constants'
import { KeycloakInstance } from 'keycloak-js';
import { Knot, Intent } from 'metamind-client';

export interface UserLogin {
  type: constants.USER_LOGIN;
  keycloak?: KeycloakInstance;
  authenticated: boolean;
}

export interface UserLogout {
  type: constants.USER_LOGOUT;
}

export interface AutoLayoutToggle {
  type: constants.AUTO_LAYOUT_TOGGLE,
  autolayout: boolean
}

export interface Search {
  type: constants.SEARCH,
  searchText: string
}

export interface KnotsFound {
  type: constants.KNOTS_FOUND;
  knots: Knot[];
}

export interface KnotUpdated {
  type: constants.KNOT_UPDATED;
  knot: Knot
}

export interface KnotDeleted {
  type: constants.KNOT_DELETED,
  knotId: string
}

export interface IntentsFound {
  type: constants.INTENTS_FOUND;
  intents: Intent[];
}

export interface IntentUpdated {
  type: constants.INTENT_UPDATED;
  intent: Intent
}

export interface IntentDeleted {
  type: constants.INTENT_DELETED,
  intentId: string
}
export interface SetKnotPositions{
  type: constants.SET_KNOT_POSITIONS
}
export interface GetKnotPositions{
  type: constants.GET_KNOT_POSITIONS,
  knotPositions?: {id:string,x:number,y:number}[]
}

export type AppAction = GetKnotPositions | SetKnotPositions| UserLogin | UserLogout | AutoLayoutToggle | KnotsFound | KnotUpdated | KnotDeleted | IntentsFound | IntentUpdated | IntentDeleted | Search;

export function userLogin(keycloak: KeycloakInstance, authenticated: boolean): UserLogin {
  return {
    type: constants.USER_LOGIN,
    keycloak: keycloak,
    authenticated: authenticated
  }
}

export function autoLayoutToggle(autolayout: boolean): AutoLayoutToggle {
  return {
    type: constants.AUTO_LAYOUT_TOGGLE,
    autolayout: autolayout
  }
}

export function search(searchText: string): Search {
  return {
    type: constants.SEARCH,
    searchText: searchText
  }
}

export function userLogout(): UserLogout {
  return {
    type: constants.USER_LOGOUT
  }
}

export function intentsFound(intents: Intent[]): IntentsFound {
  return {
    type: constants.INTENTS_FOUND,
    intents: intents
  }
}

export function intentUpdated(intent: Intent): IntentUpdated {
  return {
    type: constants.INTENT_UPDATED,
    intent: intent
  }
}

export function intentDeleted(intentId: string): IntentDeleted {
  return {
    type: constants.INTENT_DELETED,
    intentId: intentId
  }
}

export function knotsFound(knots: Knot[]): KnotsFound {
  return {
    type: constants.KNOTS_FOUND,
    knots: knots
  }
}

export function knotUpdated(knot: Knot): KnotUpdated {
  return {
    type: constants.KNOT_UPDATED,
    knot: knot
  }
}

export function knotDeleted(knotId: string): KnotDeleted {
  return {
    type: constants.KNOT_DELETED,
    knotId: knotId
  }
}
export const getKnotLocalPositions = ():GetKnotPositions => {
  try {
    const serializedState = localStorage.getItem('knot-positions');
    if (serializedState === null) {
      return {type:constants.GET_KNOT_POSITIONS,knotPositions:undefined};
    }
      return {type:constants.GET_KNOT_POSITIONS,knotPositions:JSON.parse(serializedState)};
  } catch (err) {
    return {type:constants.GET_KNOT_POSITIONS,knotPositions:undefined};
  }
}
export const writeKnotLocalPositions = (positions:{id:string,x:number,y:number}[]):SetKnotPositions => {
  try {
    const serializedState = JSON.stringify(positions);
    localStorage.setItem('knot-positions', serializedState);

  } catch {
    // ignore write errors
  }
  return {type:constants.SET_KNOT_POSITIONS}
};
