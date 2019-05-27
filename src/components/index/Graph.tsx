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

const GLOBAL_NODE_ID = "GLOBAL";
const globalNode: INode = {
  id: GLOBAL_NODE_ID,
  title: "Global", // Localize
  x:0,
  y:0
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
  /**
   * Updates component state when knots or intents are changed
   */
  static getDerivedStateFromProps = (props: Props, state: State) => {

    const { nodes } = state.graph;
   const { knots, intents } = props;
   const newNodes = knots.map((knot: Knot) => {
     const previousNode = nodes.find((node) => node.id == knot.id);
     const x = previousNode ? previousNode.x : undefined;
     const y = previousNode ? previousNode.y : undefined;
     return Graph.translateKnot(knot, x || 0, y || 0);
   });
   const pendingNodes = nodes.filter(node => node.id && node.id.startsWith("pending"));
   const newStateNodes = nodes.filter(node => node.id && node.id.startsWith("new"));
   newStateNodes.forEach(((n) => {n.id = n.id.replace("new-", "")}));
   const nodesToAssign = [ globalNode ].concat( newNodes ).concat( pendingNodes ).concat( newStateNodes );

   return {
     graph: {
       nodes:nodesToAssign,
       edges: intents.map(intent =>{

         let sourceNode:undefined|INode=undefined;
         let targetNode:undefined|INode=undefined;
         for(let i=0;i<nodesToAssign.length;i++){
           if(nodesToAssign[i].id===intent.sourceKnotId){
             sourceNode = nodesToAssign[i];
           }
           if(nodesToAssign[i].id===intent.targetKnotId){

             targetNode= nodesToAssign[i];
           }
         }


         return Graph.translateIntent(intent,sourceNode,targetNode);



       })
     }
   };
  }

  public componentDidMount = async () =>{
    const knotsService = Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "");
    const intentsService = Api.getIntentsService(this.props.keycloak ? this.props.keycloak.token! : "");

    const [ knots, intents ] = await Promise.all([
      knotsService.listKnots(this.props.storyId),
      intentsService.listIntents(this.props.storyId)
    ]);

    this.props.onKnotsFound(knots);
    this.props.onIntentsFound(intents);
  }

  /*
   * Render
   */
  public render() {
    console.log({api:Api});
    console.log(this.state.graph.nodes);
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


  /**
   * Translates knot into node
   *
   * @param knot knot to translate
   * @param x x coordinate
   * @param y  y coordinate
   */
  private static translateKnot(knot: Knot, x: number, y: number): INode {
    return {
      id: knot.id||Date.now().toString(),
      title: knot.name,
      x: x,
      y: y
    }
  }

  /**
   * Translates intent into edge
   *
   * @param intent intent to translate
   */
  private static translateIntent(intent: Intent,sourceNode?:INode,targetNode?:INode): IEdge {
    if(sourceNode&&targetNode){
      return {
        id: intent.id||Date.now().toString(),
        source: sourceNode,
        target: targetNode
      }
    }else{
      return {
        id: intent.id||Date.now().toString(),
        source: globalNode,
        target: globalNode
      }
    }

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
