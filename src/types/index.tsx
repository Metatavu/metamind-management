import { KeycloakInstance } from "keycloak-js";
import {Intent, Knot  } from "metamind-client";
interface IKnotPosition {
  id: string;
  x: number;
  y: number;
}
export interface IStoreState {
  keycloak?: KeycloakInstance;
  authenticated: boolean;
  autolayout: boolean;
  knots: Knot[];
  intents: Intent[];
  searchText: string;
  knotPositions?: IKnotPosition[];
}
