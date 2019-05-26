import * as React from 'react';

import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions/";
import GraphView,{ IEdge, INode} from "./GraphView";
import Api, { Intent, Knot } from "metamind-client";

import { KeycloakInstance } from 'keycloak-js';
import '../../styles/graph.css';

interface IGraph {
  nodes: INode[];
  edges: IEdge[];
};

interface Props {
  onSelectNode: (item: INode | null) => void
  onSelectEdge: (item: IEdge | null) => void
  onKnotsFound: (knots: Knot[]) => void
  onKnotUpdated: (knot: Knot) => void
  onKnotDeleted: (knotId: string) => void
  onIntentsFound: (intents: Intent[]) => void
  onIntentUpdated: (intent: Intent) => void
  onIntentDeleted: (intentId: string) => void

  keycloak?: KeycloakInstance
  knots: Knot[]
  intents: Intent[]
  autolayout: boolean,
  searchText: string,
  storyId: string
};

interface State {
  graph: IGraph;
  selected: any;
  copiedNode: any;
  searchResultKnotIds: string[]
};



class Graph extends React.Component<Props, State> {
  GraphViewRef: any

  constructor(props: Props) {
    super(props);

    this.state = {
      copiedNode: null,
      graph: {
        edges: [],
        nodes: []
      },

      selected: null,
      searchResultKnotIds: []
    };

    this.GraphViewRef = React.createRef();
  }


  /*
   * Render
   */
  public render() {
    console.log({api:Api});

    return (
      <div id="graph" style={{width: "100vw", height: "100vh"}} className={ !!this.props.searchText ? "search-active" : "" }>
      <GraphView
      height={window.innerHeight}
      width={window.innerWidth}
      onEdgeClick={this.onEdgeClick}
      onDeleteEdge={this.onDeleteEdge}
      onCreateEdge={this.onCreateEdge}
      onDeleteNode={this.onDeleteNode}
      onCreateNode={this.onCreateNode}
      onNodeDragEnd={this.onNodeDragEnd}
      onNodeClick={this.onNodeClick}
      filterIds={[]}
      nodes={this.state.graph.nodes}
      edges={this.state.graph.edges}/>
      </div>
    );
  }
  onNodeClick = (viewNode:INode)=>{
    console.log({message:"Node clicked",viewNode});
  }
  onNodeDragEnd = (viewNode:INode)=>{
    console.log({message:"Node dragged",viewNode});
  }
  onCreateNode = (viewNode:INode)=>{
    console.log({message:"Node created",viewNode});
  }
  onDeleteNode = (viewNode:INode)=>{
    console.log({message:"Node deleted",viewNode});
  }
  onCreateEdge = (viewEdge:IEdge)=>{
    console.log({message:"Edge created",viewEdge});
  }
  onDeleteEdge = (viewEdge:IEdge)=>{
    console.log({message:"Edge deleted",viewEdge});
  }
  onEdgeClick = (viewEdge:IEdge)=>{
    console.log({message:"Edge clicked",viewEdge});
  }

}

export function mapStateToProps(state: StoreState) {
  return {
    autolayout: state.autolayout,
    searchText: state.searchText,
    knots: state.knots,
    intents: state.intents,
    keycloak: state.keycloak
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onKnotsFound: (knots: Knot[]) => dispatch(actions.knotsFound(knots)),
    onKnotUpdated: (knot: Knot) => dispatch(actions.knotUpdated(knot)),
    onKnotDeleted: (knotId: string) => dispatch(actions.knotDeleted(knotId)),
    onIntentsFound: (intents: Intent[]) => dispatch(actions.intentsFound(intents)),
    onIntentUpdated: (intent: Intent) => dispatch(actions.intentUpdated(intent)),
    onIntentDeleted: (intentId: string) => dispatch(actions.intentDeleted(intentId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
