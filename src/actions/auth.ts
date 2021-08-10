import { KeycloakInstance } from "keycloak-js";
import * as ActionTypes from "../constants/actionTypes";

/**
 * Interface for login action type
 */
export interface LoginAction {
  type: ActionTypes.LOGIN;
  keycloak: KeycloakInstance;
}

/**
 * Interface for logout action type
 */
export interface LogoutAction {
  type: ActionTypes.LOGOUT;
}

/**
 * Store update method for access token
 *
 * @param keycloak keycloak instance
 */
export function login(keycloak: KeycloakInstance): LoginAction {
  return {
    type: ActionTypes.LOGIN,
    keycloak: keycloak
  };
}

/**
 * Store logout method
 */
export function logout(): LogoutAction {
  return {
    type: ActionTypes.LOGOUT
  };
}

export type AuthAction = LoginAction | LogoutAction;