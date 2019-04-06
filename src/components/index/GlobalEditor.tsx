import * as React from "react";
import * as Keycloak from 'keycloak-js';
import * as actions from "../../actions";
import { StoreState } from "../../types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import ScriptEditor from "./ScriptEditor";

/**
 * Component props
 */
interface Props {
  storyId: string,
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance
}

/**
 * Component state
 */
interface State {
}

/**
 * Global editor
 */
class GlobalEditor extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  /**
   * Component render method
   */
  public render() {
    return (
      <ScriptEditor storyId={ this.props.storyId }/>
    );
  }

}

export function mapStateToProps(state: StoreState) {
  return {
    authenticated: state.authenticated,
    keycloak: state.keycloak
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onLogin: (keycloak: KeycloakInstance, authenticated: boolean) => dispatch(actions.userLogin(keycloak, authenticated))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalEditor);;