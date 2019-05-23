import * as React from 'react';

import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions/"

import Api, { Intent, Knot } from "metamind-client";
import {ForceGraph2D} from "react-force-graph";


import  {
  NODE_KEY,
  TEXT_TYPE,
  OPENNLP_EDGE_TYPE,
  GLOBAL_TYPE,
  PENDING_TYPE
} from '../../utils/graph-config'; // Configures node/edge types
import { KeycloakInstance } from 'keycloak-js';
import '../../styles/graph.css'

export interface INode{
  id?: string,
  name: string,
  type: string,
  x?: number,
  y?: number,
  newest?:boolean
}
export interface IEdge{
  id?: string,
  source:string,
  target:string,
  type:string
}
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
  onCloseSidebar: () => void

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
  edgeDrawStart:any;
  copiedNode: any;
  searchResultKnotIds: string[]
};

const GLOBAL_NODE_ID = "GLOBAL";

class Graph extends React.Component<Props, State> {
  GraphViewRef: any;


  constructor(props: Props) {
    super(props);

    this.state = {
      copiedNode: null,
      graph: {
        edges: [],
        nodes: []
      },
      selected: null,
      edgeDrawStart:null,
      searchResultKnotIds: []

    };

    this.GraphViewRef = React.createRef();

  }

  /**
   * Updates component state when knots or intents are changed
   */
  static getDerivedStateFromProps = (props: Props, state: State) => {
    const globalNode: INode = {
      id: GLOBAL_NODE_ID,
      name: "Global", // Localize
      type: GLOBAL_TYPE,
      x:0,
      y:0
    };

    const { nodes } = state.graph;
    const { knots, intents } = props;
    const newNodes = knots.map((knot: Knot) => {
      const previousNode = nodes.find((node) => node.id == knot.id);
      const x = previousNode ? previousNode.x : undefined;
      const y = previousNode ? previousNode.y : undefined;
      return Graph.translateKnot(knot, x || undefined, y || undefined);
    });
    const pendingNodes = nodes.filter(node => node.id && node.id.startsWith("pending"));
    const newStateNodes = nodes.filter(node => node.id && node.id.startsWith("new"));
    newStateNodes.forEach(((n) => {
      if(n.id){
        n.id = n.id.replace("new-", "");
      }
    }));

    return {
      graph: {
        nodes: [ globalNode ].concat( newNodes ).concat( pendingNodes ).concat( newStateNodes ),
        edges: intents.map(intent => Graph.translateIntent(intent))
      }
    };
  }

  /**
   * Loads intents and knots while graph is mounted
   */
  public componentDidMount = async () => {


    const knotsService = Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "");
    const intentsService = Api.getIntentsService(this.props.keycloak ? this.props.keycloak.token! : "");

    const [ knots, intents ] = await Promise.all([
      knotsService.listKnots(this.props.storyId),
      intentsService.listIntents(this.props.storyId)
    ]);

    this.props.onKnotsFound(knots);
    this.props.onIntentsFound(intents);




    window.addEventListener("keydown",event=>{
      if(event.keyCode===46){

        if(this.state.selected){

            if(this.state.selected.name){




              this.onDeleteNode(this.state.selected,this.state.selected.id,this.state.graph.nodes);

            }else{

              this.onDeleteEdge(this.state.selected,this.state.graph.edges);
            }
        };

      };

    });

  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({
        searchResultKnotIds: this.searchKnots(), selected:null
      });
    }
  }

  private searchKnots = (): string[] => {
    if (!this.props.searchText) {
      return [];
    }

    const searchText = this.props.searchText.toLowerCase();

    const filteredKnots = this.props.knots.filter((knot) => {
      const name = knot.name.toLowerCase();
      if (name && name.includes(searchText)) {
        return true;
      }

      const content = knot.content.toLowerCase();
      if (content && content.includes(searchText)) {
        return true;
      }

      return false;
    })
    .map((knot) => {
      return knot.id!;
    });
    const filteredIntents = this.props.intents.filter((intent) => {
      if(intent.name){
        const name = intent.name.toLowerCase();
        if (name && name.includes(searchText)) {
          return true;
        }
      }



      return false;
    })
    .map((intent) => {
      return intent.id!;
    });
    return filteredKnots.concat(filteredIntents);
  }


  //Helps to handle node and edge creation
  private onGraphClick = (event:any):void=>{

    const canvas = this.GraphViewRef.current.childNodes[0].childNodes[0].childNodes[0];
    const transform = canvas.__zoom;

    const x = (event.clientX-transform.x)/transform.k;
    const y = (event.clientY-transform.y)/transform.k;

    if(event.shiftKey){
        const selected = this.state.selected;
        this.setState({selected:null});

        if(selected!==this.state.edgeDrawStart){
          if(selected===null){
            this.onCreateNode(x,y);
          }else if(this.state.edgeDrawStart!==null){

            this.onCreateEdge(this.state.edgeDrawStart,selected);
          }
          this.setState({edgeDrawStart:null});

        }else{
          this.onCreateNode(x,y);
        }




    }
    if(this.state.selected){
      this.setState({edgeDrawStart:this.state.selected});



    }

  };
  private getNodeColor = (viewNode:INode)=>{


    if(this.state.selected&&this.state.selected.id===viewNode.id){
      viewNode.newest=false;



      return "red";
    }
    if(viewNode.id){
      if(this.state.searchResultKnotIds.includes(viewNode.id)){

          viewNode.newest=false;
          return "orange";
      }
    }
    if(viewNode.newest){

        return "green";



    }





    return "blue";
  }
  private getLinkColor = (viewLink:IEdge)=>{
    if(this.state.selected&&this.state.selected.id===viewLink.id){
      return "red";
    }

    if(viewLink.id){
      if(this.state.searchResultKnotIds.includes(viewLink.id)){


          return "orange";
      }
    }



    return "blue";
  }
  //Updates state after node dragging
  private onNodeDragEnd = (viewNode:INode)=>{
    for(let i = 0;i<this.state.graph.nodes.length;i++){
      let nodes = this.state.graph.nodes;
      if(nodes[i].id===viewNode.id){
        nodes[i].x = viewNode.x;
        nodes[i].y = viewNode.y;
        let graph = this.state.graph;
        graph.nodes = nodes;
        this.setState({graph});

      }
    }

  }


  /*
   * Render
   */
  public render() {


    const { nodes, edges } = this.state.graph;


    const newNodes = nodes.map((node,i)=>{


      if(node.id==="GLOBAL"){

        return {...node,name:node.name,val:3,x:0,y:0};
      }

      const newest = i===nodes.length-1;



      return {...node,val:1,newest};


    });
    const newEdges = edges;
    const graphData = {nodes:newNodes,links:newEdges};
    if(this.state.selected===null){
      this.props.onCloseSidebar();
    }

    return (


      <div ref={this.GraphViewRef}    onClick={this.onGraphClick} id="graph"  className={ !!this.props.searchText ? "search-active" : "" }>

      <ForceGraph2D d3AlphaDecay={1} zoom={1} d3VelocityDecay={1} onNodeDragEnd={this.onNodeDragEnd} linkDirectionalArrowLength={3} nodeId={NODE_KEY} onLinkClick={this.onSelectEdge} linkColor={this.getLinkColor} nodeColor={this.getNodeColor} onNodeClick={this.onSelectNode} graphData={graphData}/>


      </div>



    );
  }

  /**
   * Translates intent into edge
   *
   * @param intent intent to translate
   */
  private static translateIntent(intent: Intent): IEdge {
    return {
      id: intent.id,
      source: intent.global ? GLOBAL_NODE_ID : intent.sourceKnotId || "",
      target: intent.targetKnotId,
      type: OPENNLP_EDGE_TYPE
    }
  }

  /**
   * Translates knot into node
   *
   * @param knot knot to translate
   * @param x x coordinate
   * @param y  y coordinate
   */
  private static translateKnot(knot: Knot, x?: number, y?: number): INode {
    return {
      id: knot.id,
      name: knot.name,
      type: TEXT_TYPE,
      x: x,
      y: y
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



  /**
   * Handles node selection
   */
  private onSelectNode = (viewNode: INode | null) => {
    // Deselect events will send Null viewNode
    this.setState({ selected: viewNode });
    this.props.onSelectNode(viewNode);
  }

  /**
   * Handles edge selection
   */
  private onSelectEdge = (viewEdge: IEdge) => {
    this.setState({ selected: viewEdge });
    this.props.onSelectEdge(viewEdge);
  }

  /**
   * Updates the graph with a new node
   */
  private onCreateNode = async (x: number, y: number) => {
    const graph = this.state.graph;
    const tempNodeId = `pending-${new Date().getTime()}`;
    const node = {
      id: tempNodeId,
      name: "loading",
      type: PENDING_TYPE,
      x: x,
      y: y
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
        const translatedNode = Graph.translateKnot(knot, x, y);
        translatedNode.id = `new-${translatedNode.id}`;
        return translatedNode;
      }

      return n;
    });

    graph.nodes = newNodes;

    this.setState({ graph });

    this.props.onKnotsFound([knot]);

  }

  /**
   * Creates a new edge between two nodes
   */
  private onCreateEdge = async (sourceViewNode: INode, targetViewNode: INode) => {
    const graph = this.state.graph;
    if(sourceViewNode.id&&targetViewNode.id){
      const intent = await Api.getIntentsService(this.props.keycloak ? this.props.keycloak.token! : "").createIntent({
        type: "NORMAL",
        name: "New intent",
        quickResponseOrder: 0,
        global: sourceViewNode.id === GLOBAL_NODE_ID,
        sourceKnotId: sourceViewNode.id === GLOBAL_NODE_ID ? undefined : sourceViewNode.id ,
        targetKnotId: targetViewNode.id,
        trainingMaterials: {}
      }, this.props.storyId);

      const viewEdge = Graph.translateIntent(intent);

      graph.edges = [...graph.edges, viewEdge];
      this.setState({
        graph,
        selected: viewEdge
      });

      this.props.onIntentsFound([intent]);
    }

  }



  /**
   * Event handler for edge deletion
   *
   * @param viewEdge edge
   * @param edges edges after deletion
   */
  private onDeleteEdge = async (viewEdge: IEdge, edges: IEdge[]) => {
    if(viewEdge.id){
      await this.deleteIntent(viewEdge.id);
      this.setState({
        selected: null
      });
    }

  }

  /**
   * Event handler for node deletion
   *
   * @param viewNode node
   * @param nodeId node id
   * @param nodes nodes after deletion
   */
  private onDeleteNode = async (viewNode: INode, nodeId: string, nodes: INode[]) => {
    if(viewNode.id){
      const graph = this.state.graph;
      const edges = [];


      for (let i = 0; i < graph.edges.length; i++) {
        const edge = graph.edges[i];

        if (edge.source[NODE_KEY] !== viewNode.id && edge.target[NODE_KEY] !== viewNode.id) {
          edges.push(edge);
        } else {
          if(edge.id){
                    await this.deleteIntent(edge.id);
          }

        }

      }

      await Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "").deleteKnot(this.props.storyId, viewNode.id);


      this.props.onKnotDeleted(viewNode.id);
      this.setState({ selected: null });
    }

  }

  onUndo = () => {
    // Not implemented
    console.warn('Undo is not currently implemented in the example.');
    // Normally any add, remove, or update would record the action in an array.
    // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
    // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
    // into the edges array at position i.
  }

  onCopySelected = () => {
    if (this.state.selected.source) {
      console.warn('Cannot copy selected edges, try selecting a node instead.');
      return;
    }
    const x = this.state.selected.x + 10;
    const y = this.state.selected.y + 10;
    this.setState({
      copiedNode: { ...this.state.selected, x, y }
    });
  }

  onPasteSelected = () => {
    if (!this.state.copiedNode) {
      console.warn('No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C');
    }
    const graph = this.state.graph;
    const newNode = { ...this.state.copiedNode, id: Date.now() };
    graph.nodes = [...graph.nodes, newNode];
    this.forceUpdate();
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
