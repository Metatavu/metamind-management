import * as constants from '../constants'
import { KeycloakInstance } from 'keycloak-js';

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

export type AppAction = UserLogin | UserLogout | AutoLayoutToggle;

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

export function userLogout(): UserLogout {
  return {
    type: constants.USER_LOGOUT
  }
}