import * as Keycloak from "keycloak-js";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../../actions";
import { IStoreState } from "../../types";

import { Tab } from "semantic-ui-react";
import ScriptEditor from "./ScriptEditor";
import VariableEditor from "./VariableEditor";

/**
 * Component props
 */
interface IProps {
  storyId: string;
  authenticated: boolean;
  keycloak?: Keycloak.KeycloakInstance;
}

/**
 * Component state
 */
interface IState {
  loading: boolean;
}

/**
 * Global editor
 */
class GlobalEditor extends React.Component<IProps, IState> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  /**
   * Component render method
   */
  public render() {
    const tabPanes = [
      { menuItem: "Scripts", render: () => <Tab.Pane style={{ padding: 0, border: "none" }}><ScriptEditor storyId={ this.props.storyId }/></Tab.Pane> },
      { menuItem: "Variables", render: () => <Tab.Pane style={{ padding: 0, border: "none" }}><VariableEditor storyId={ this.props.storyId }/></Tab.Pane> },
    ];

    return (
      <Tab style={{ marginTop: "30px" }} menu={{ inverted: true, borderless: true }} panes={ tabPanes }/>
    );
  }

}

export function mapStateToProps(state: IStoreState) {
  return {
    authenticated: state.authenticated,
    keycloak: state.keycloak,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onLogin: (keycloak: KeycloakInstance, authenticated: boolean) => dispatch(actions.userLogin(keycloak, authenticated)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalEditor);
