import * as Keycloak from "keycloak-js";
import * as React from "react";

import { KeycloakInstance } from "keycloak-js";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";
import { IStoreState } from "src/types";
import * as actions from "../../actions/";
import BasicLayout from "../generic/BasicLayout";

import { Segment, Sidebar } from "semantic-ui-react";
import "../../styles/common.scss";
import { GLOBAL_TYPE } from "../../utils/graph-config";
import GlobalEditor from "./GlobalEditor";
import Graph from "./Graph";
import { IEdge, INode } from "./GraphView";
import IntentEditor from "./IntentEditor";
import KnotEditor from "./KnotEditor";
import StorySelector from "./StorySelector";
import { TrainingMaterialVisibility } from "metamind-client";

interface IProps {
  authenticated: boolean;
  keycloak?: Keycloak.KeycloakInstance;
}

interface IState {
  sidebarVisible: boolean;
  selectedNode: INode | null;
  selectedEdge: IEdge | null;
  storyId?: string;
  trainingMaterialVisibility: TrainingMaterialVisibility;
}

class WelcomePage extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedEdge: null,
      selectedNode: null,
      sidebarVisible: false,
      trainingMaterialVisibility: TrainingMaterialVisibility.LOCAL,
    };
  }

  public render() {

    return (
      <BasicLayout>
        { this.props.authenticated ? (
        <Sidebar.Pushable style={{border: "none"}} as={Segment}>
          <Sidebar
            as={Segment}
            animation="overlay"
            icon="labeled"
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
      return <div style={{ minHeight: "400px" }}><StorySelector onStorySelected={ (storyId) => { this.setState({ storyId}); } } /></div>;
    } else {
      return <Graph storyId={ this.state.storyId } onSelectNode={this.onSelectNode} onSelectEdge={this.onSelectEdge} />;
    }
  }

  /**
   * Renders sidebar contents
   */
  private renderSidebarContent = (): JSX.Element | null => {
    if (this.state.selectedEdge && this.state.storyId) {
      return <IntentEditor storyId={ this.state.storyId } intentId={ this.state.selectedEdge.id } trainingMaterialVisibility={ this.state.trainingMaterialVisibility }/>;
    }

    if (this.state.selectedNode && this.state.storyId && this.state.selectedNode.type === GLOBAL_TYPE) {
      return <GlobalEditor storyId={ this.state.storyId } />;
    }

    if (this.state.selectedNode && this.state.storyId && this.state.selectedNode.type !== GLOBAL_TYPE) {
      return <KnotEditor storyId={ this.state.storyId } knotId={this.state.selectedNode.id} />;
    }

    return null;
  }

  private onSelectNode = (item: INode | null) => {
    this.setState({
      selectedEdge: null,
      selectedNode: item,
      sidebarVisible: !!item,

    });
  }

  private onSelectEdge = (item: IEdge | null) => {
    this.setState({
      selectedEdge: item,
      selectedNode: null,
      sidebarVisible: !!item,

    });
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
