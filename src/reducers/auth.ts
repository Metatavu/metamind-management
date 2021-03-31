import { AuthAction } from "../actions/auth";
import { LOGIN, LOGOUT } from "../constants/actionTypes";
import { KeycloakInstance } from "keycloak-js";
import { AccessToken } from "../types";

/**
 * Redux auth state
 */
export interface AuthState {
  accessToken?: AccessToken;
  keycloak?: KeycloakInstance;
}

/**
 * Initial auth state
 */
const initialState: AuthState = {
  accessToken: undefined,
  keycloak: undefined
}

/**
 * Redux reducer for authorization
 *
 * @param state auth state
 * @param action auth action
 * @returns changed auth state
 */
export function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case LOGIN:
      const keycloak = action.keycloak;
      const { token, tokenParsed } = keycloak;
      const userId = tokenParsed?.sub;
      const accessToken = userId && token ?
        { token, userId } :
        undefined;

      return { ...state, keycloak: keycloak, accessToken: accessToken };
    case LOGOUT:
      return { ...state, keycloak: undefined, accessToken: undefined };
    default:
      return state;
  }
}
