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
  getKnotLocalPositions: ()=>void
  writeKnotLocalPositions: (knotPositions:KnotPosition[])=>void

  keycloak?: KeycloakInstance
  knots: Knot[]
  intents: Intent[]
  autolayout: boolean,
  searchText: string,
  storyId: string,
  knotPositions?:KnotPosition[];
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
     const previousNode =props.knotPositions?props.knotPositions.find((node) => node.id == knot.id):undefined;

     const x = previousNode ? previousNode.x : 0;
     const y = previousNode ? previousNode.y : 0;
     return Graph.translateKnot(knot, x,y);
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


         return Graph.translateIntent(intent,sourceNode||globalNode,targetNode||globalNode);



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
    this.props.getKnotLocalPositions();
  }

  /*
   * Render
   */
  public render() {

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
  /**
  * Handles node selection
  */
 private onNodeClick = (viewNode:INode)=>{
    this.setState({ selected: viewNode });
   this.props.onSelectNode(viewNode);
  }
  /**
 * Called by 'drag' handler, etc..
 * to sync updates from D3 with the graph
 */
private onNodeDragEnd = (viewNode: INode) => {

  if(this.props.knotPositions){
    this.props.writeKnotLocalPositions(this.props.knotPositions.map(pos=>{
      if(pos.id===viewNode.id){
        return {...pos,x:viewNode.x,y:viewNode.y}
      }
      return pos;
    }));
  }


}

  /**
  * Updates the graph with a new node
  */
 private onCreateNode = async (viewNode:INode) => {
   const graph = this.state.graph;
   const tempNodeId = `pending-${new Date().getTime()}`;
   const node = {
     id: tempNodeId,
     title: "loading",
     x: viewNode.x,
     y: viewNode.y
   };
   graph.nodes = [...graph.nodes, node];

   this.setState({ graph });
   const knot = await Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "").createKnot({
     content: "New knot",
     name: "New knot",
     type: "TEXT",
     tokenizer: "WHITESPACE"
   }, this.props.storyId);

   const newNodes = graph.nodes.map((n: INode) => {
     if (n.id === tempNodeId) {
       const translatedNode = Graph.translateKnot(knot, viewNode.x, viewNode.y);
       translatedNode.id = `new-${translatedNode.id}`;
       return translatedNode;
     }

     return n;
   });

   graph.nodes = newNodes;
   this.setState({ graph });

   this.props.onKnotsFound([knot]);
   const knotLocalPositions = newNodes.map(node=>{
     return {id:node.id,x:node.x,y:node.y};
   });


   this.props.writeKnotLocalPositions(knotLocalPositions);



 }
 /**
* Event handler for node deletion
*
* @param viewNode node
* @param nodeId node id
* @param nodes nodes after deletion
*/
private onDeleteNode = async (viewNode: INode) => {
 const graph = this.state.graph;

 await Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "").deleteKnot(this.props.storyId, viewNode.id);

 const edges = [];

 for (let i = 0; i < graph.edges.length; i++) {
   const edge = graph.edges[i];
   if (edge.source.id !== viewNode.id && edge.target.id !== viewNode.id) {
     edges.push(edge);
   } else {
     await this.deleteIntent(edge.id);
   }
 }

 this.props.onKnotDeleted(viewNode.id);
 this.setState({ selected: null });
 this.props.onSelectNode(null);
}
/**
 * Creates a new edge between two nodes
 */
private onCreateEdge = async (sourceViewNode: INode, targetViewNode: INode) => {

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
  private static translateIntent(intent: Intent,sourceNode:INode,targetNode:INode): IEdge {

      return {
        id: intent.id||Date.now().toString(),
        source: sourceNode,
        target: targetNode
      }


  }
  /**
  * Deletes an intent
  *
  * @param id id of intent to delete
  */
 private deleteIntent = async (id: string) => {
   await Api.getIntentsService(this.props.keycloak ? this.props.keycloak.token! : "").deleteIntent(this.props.storyId, id);
   this.props.onIntentDeleted(id);
 }


}


export function mapStateToProps(state: StoreState) {
  return {
    autolayout: state.autolayout,
    searchText: state.searchText,
    knots: state.knots,
    intents: state.intents,
    keycloak: state.keycloak,
    knotPositions:state.knotPositions
  };
}
interface KnotPosition{
  x:number,y:number,id:string
}
export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onKnotsFound: (knots: Knot[]) => dispatch(actions.knotsFound(knots)),
    onKnotUpdated: (knot: Knot) => dispatch(actions.knotUpdated(knot)),
    onKnotDeleted: (knotId: string) => dispatch(actions.knotDeleted(knotId)),
    onIntentsFound: (intents: Intent[]) => dispatch(actions.intentsFound(intents)),
    onIntentUpdated: (intent: Intent) => dispatch(actions.intentUpdated(intent)),
    onIntentDeleted: (intentId: string) => dispatch(actions.intentDeleted(intentId)),
    getKnotLocalPositions: () => dispatch(actions.getKnotLocalPositions()),
    writeKnotLocalPositions: (knotPositions:KnotPosition[]) => dispatch(actions.writeKnotLocalPositions(knotPositions))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
