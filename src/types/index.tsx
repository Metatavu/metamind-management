import { KeycloakInstance } from "keycloak-js";
import { Knot, Intent } from "metamind-client";

export interface StoreState {
  keycloak?: KeycloakInstance,
  authenticated: boolean,
  autolayout: boolean
  knots: Knot[],
  intents: Intent[]
}