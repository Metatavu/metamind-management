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
import StorySelector from "./StorySelector";
import KnotEditor from "./KnotEditor";
import { GLOBAL_TYPE } from "../../utils/graph-config";
import GlobalEditor from "./GlobalEditor";

interface Props {
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance
}

interface State {
  sidebarVisible: boolean,
  selectedNode: INode | null,
  selectedEdge: IEdge | null,
  storyId?: string
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
        { this.props.authenticated ? (
        <Sidebar.Pushable style={{border: "none"}} as={Segment}>
          <Sidebar
            as={Segment}
            animation='overlay'
            icon='labeled'
            inverted
            direction="right"
            vertical
            visible={this.state.sidebarVisible}
            width="very wide"
          >
            { this.renderSidebarContent() }
          </Sidebar>

          <Sidebar.Pusher>
            { this.renderContent() }
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        ) : (
          <Redirect to="/login" />
        )}
      </BasicLayout>
    );
  }

  private renderContent() {
    if (!this.state.storyId) {
      return <div style={{ minHeight: "400px" }}><StorySelector onStorySelected={ (storyId) => { this.setState({ storyId: storyId}) } } /></div>
    } else {
      return <Graph storyId={ this.state.storyId } onSelectNode={this.onSelectNode} onSelectEdge={this.onSelectEdge} />
    }
  }

  /**
   * Renders sidebar contents
   */
  private renderSidebarContent = (): JSX.Element | null => {
    if (this.state.selectedEdge && this.state.storyId) {
      return <IntentEditor storyId={ this.state.storyId } intentId={this.state.selectedEdge.id} />
    }

    if (this.state.selectedNode && this.state.storyId && this.state.selectedNode.type === GLOBAL_TYPE) {
      return <GlobalEditor storyId={ this.state.storyId } />
    }

    if (this.state.selectedNode && this.state.storyId && this.state.selectedNode.type !== GLOBAL_TYPE) {
      return <KnotEditor storyId={ this.state.storyId } knotId={this.state.selectedNode.id} />
    }

    return null;
  }

  private onSelectNode = (item: INode | null) => {
    this.setState({
      sidebarVisible: !!item,
      selectedEdge: null,
      selectedNode: item
    });
  }

  private onSelectEdge = (item: IEdge | null) => {
    this.setState({
      sidebarVisible: !!item,
      selectedEdge: item,
      selectedNode: null
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
