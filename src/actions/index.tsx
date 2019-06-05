import { KeycloakInstance } from "keycloak-js";
import { Intent, Knot } from "metamind-client";
import * as constants from "../constants";

export interface IUserLogin {
  type: constants.USER_LOGIN;
  keycloak?: KeycloakInstance;
  authenticated: boolean;
}

export interface IUserLogout {
  type: constants.USER_LOGOUT;
}

export interface IAutoLayoutToggle {
  type: constants.AUTO_LAYOUT_TOGGLE;
  autolayout: boolean;
}

export interface ISearch {
  type: constants.SEARCH;
  searchText: string;
}

export interface IKnotsFound {
  type: constants.KNOTS_FOUND;
  knots: Knot[];
}

export interface IKnotUpdated {
  type: constants.KNOT_UPDATED;
  knot: Knot;
}

export interface IKnotDeleted {
  type: constants.KNOT_DELETED;
  knotId: string;
}

export interface IIntentsFound {
  type: constants.INTENTS_FOUND;
  intents: Intent[];
}

export interface IIntentUpdated {
  type: constants.INTENT_UPDATED;
  intent: Intent;
}

export interface IIntentDeleted {
  type: constants.INTENT_DELETED;
  intentId: string;
}

export interface ISetKnotPositions {
  type: constants.SET_KNOT_POSITIONS;
    knotPositions?: Array<{id: string, x: number, y: number}>;
}

export interface IGetKnotPositions {
  type: constants.GET_KNOT_POSITIONS;
  knotPositions?: Array<{id: string, x: number, y: number}>;
}

export type AppAction =
IGetKnotPositions |
ISetKnotPositions |
IUserLogin |
IUserLogout |
IAutoLayoutToggle |
IKnotsFound |
IKnotUpdated |
IKnotDeleted |
IIntentsFound |
IIntentUpdated |
IIntentDeleted |
ISearch;

export function userLogin(keycloak: KeycloakInstance, authenticated: boolean): IUserLogin {
  return {
    authenticated,
    keycloak,
    type: constants.USER_LOGIN,

  };
}

export function autoLayoutToggle(autolayout: boolean): IAutoLayoutToggle {
  return {
    autolayout,
    type: constants.AUTO_LAYOUT_TOGGLE,

  };
}

export function search(searchText: string): ISearch {
  return {
    searchText,
    type: constants.SEARCH,

  };
}

export function userLogout(): IUserLogout {
  return {
    type: constants.USER_LOGOUT,
  };
}

export function intentsFound(intents: Intent[]): IIntentsFound {
  return {
    intents,
    type: constants.INTENTS_FOUND,

  };
}

export function intentUpdated(intent: Intent): IIntentUpdated {
  return {
    intent,
    type: constants.INTENT_UPDATED,

  };
}

export function intentDeleted(intentId: string): IIntentDeleted {
  return {
    intentId,
    type: constants.INTENT_DELETED,

  };
}

export function knotsFound(knots: Knot[]): IKnotsFound {
  return {
    knots,
    type: constants.KNOTS_FOUND,

  };
}

export function knotUpdated(knot: Knot): IKnotUpdated {
  return {
    knot,
    type: constants.KNOT_UPDATED,

  };
}

export function knotDeleted(knotId: string): IKnotDeleted {
  return {
    knotId,
    type: constants.KNOT_DELETED,

  };
}
export const getKnotLocalPositions = (): IGetKnotPositions => {

    const serializedState = localStorage.getItem("knot-positions");

    if (serializedState === null) {
      return {type: constants.GET_KNOT_POSITIONS, knotPositions: undefined};
    }

    return {type: constants.GET_KNOT_POSITIONS, knotPositions: JSON.parse(serializedState)};

};

export const writeKnotLocalPositions = (positions: Array<{id: string, x: number, y: number}>): ISetKnotPositions => {

    const serializedState = JSON.stringify(positions);

    localStorage.setItem("knot-positions", serializedState);

    return {type: constants.SET_KNOT_POSITIONS, knotPositions: positions};
};
