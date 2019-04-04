import * as React from "react";
import * as Keycloak from 'keycloak-js';

import * as actions from "../../actions/";
import BasicLayout from "../generic/BasicLayout";
import { Redirect } from "react-router";
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import "../../styles/common.scss";
import Graph from "./Graph";
import { Sidebar, Segment } from "semantic-ui-react";
import { INode, IEdge } from "react-digraph";
import IntentEditor from "./IntentEditor";

interface Props {
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance
}

interface State {
  sidebarVisible: boolean,
  selectedNode: INode | null,
  selectedEdge: IEdge | null
}

class WelcomePage extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      sidebarVisible: false,
      selectedNode: null,
      selectedEdge: null
    };
  }

  public render() {
    return (
      <BasicLayout>
        { /*this.props.authenticated*/ true ? (
        <Sidebar.Pushable style={{border: "none"}} as={Segment}>
          <Sidebar
            as={Segment}
            animation='overlay'
            icon='labeled'
            inverted
            //onHide={this.handleSidebarHide}
            direction="right"
            vertical
            visible={this.state.sidebarVisible}
            width="very wide"
          >
            {this.renderSidebarContent()}
          </Sidebar>

          <Sidebar.Pusher>
            <Graph storyId="84c1c2a3-1911-4d49-b30f-5c6a1b0e8683" onSelectNode={this.onSelectNode} onSelectEdge={this.onSelectEdge} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        ) : (
          <Redirect to="/login" />
        )}
      </BasicLayout>
    );
  }

  private renderSidebarContent = (): JSX.Element | null => {
    if (this.state.selectedEdge) {
      return <IntentEditor storyId="84c1c2a3-1911-4d49-b30f-5c6a1b0e8683" intentId={this.state.selectedEdge.id} />
    }

    return null;
  }

  private onSelectNode = (item: INode | null) => {
    this.setState({
      sidebarVisible: !!item,
      selectedNode: item
    });
  }

  private onSelectEdge = (item: IEdge | null) => {
    console.log(item);
    this.setState({
      sidebarVisible: !!item,
      selectedEdge: item
    });
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);;