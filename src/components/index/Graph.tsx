import * as React from 'react';

import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions/"
import { GraphView, IEdge, INode, LayoutEngineType, GraphUtils } from 'react-digraph';
import Api, { Intent, Knot } from "metamind-client";
import {ForceGraph2D} from "react-force-graph";


import GraphConfig, {
  NODE_KEY,
  TEXT_TYPE,
  OPENNLP_EDGE_TYPE,
  GLOBAL_TYPE,
  PENDING_TYPE
} from '../../utils/graph-config'; // Configures node/edge types
import { KeycloakInstance } from 'keycloak-js';
import KnotText from '../generic/KnotText';
import '../../styles/graph.css'

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
  layoutEngineType?: LayoutEngineType;
  searchResultKnotIds: string[],
  newSystem:boolean
};

const GLOBAL_NODE_ID = "GLOBAL";

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
      layoutEngineType: undefined,
      selected: null,
      edgeDrawStart:null,
      searchResultKnotIds: [],
      newSystem : false
    };

    this.GraphViewRef = React.createRef();
  }

  /**
   * Updates component state when knots or intents are changed
   */
  static getDerivedStateFromProps = (props: Props, state: State) => {
    const globalNode: INode = {
      id: GLOBAL_NODE_ID,
      title: "Global", // Localize
      type: GLOBAL_TYPE
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
    newStateNodes.forEach(((n) => {n.id = n.id.replace("new-", "")}));

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

            if(this.state.selected.title){




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

    return this.props.knots.filter((knot) => {
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
  }
  onSystemChange = ():void=>{
    this.setState({newSystem:!this.state.newSystem});
  }


  onGraphClick = (event:any):void=>{
    console.log(this.state.graph.nodes);
    if(event.shiftKey){
        const selected = this.state.selected;
        this.setState({selected:null});

        if(selected!==this.state.edgeDrawStart){
          if(selected===null){
            this.onCreateNode(0,0);
          }else{
            this.onCreateEdge(selected,this.state.edgeDrawStart);
          }
          this.setState({edgeDrawStart:null});

        }else{
          this.onCreateNode(0,0);
        }




    }
    if(this.state.selected){
      this.setState({edgeDrawStart:this.state.selected});



    }

  };
  getNodeColor = (viewNode:INode)=>{
    if(this.state.selected&&this.state.selected.id===viewNode.id){
      return "red";
    }
    if(this.state.searchResultKnotIds.includes(viewNode.id)){
      return "green";
    }




    return "blue";
  }
  /*
   * Render
   */
  public render() {
    const { nodes, edges } = this.state.graph;
    const selected = this.state.selected;
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;
    const newNodes = nodes.map(node=>{
      if(node.id==="GLOBAL"){
        return {...node,name:node.title,val:3,x:0,y:0};
      }
      return {...node,name:node.title,val:1,x:0,y:0};
    });
    const newEdges = edges;
    const graphData = {nodes:newNodes,links:newEdges};
    if(this.state.selected===null){
      this.props.onCloseSidebar();
    }
    return (
      <div>

      <div  onClick={this.onGraphClick} id="graph" style={{width: "100vw", height: "100vh"}} className={ !!this.props.searchText ? "search-active" : "" }>

      {this.state.newSystem!=false?<ForceGraph2D  nodeId={NODE_KEY} onLinkClick={this.onSelectEdge}  nodeColor={this.getNodeColor} onNodeClick={this.onSelectNode} graphData={graphData}/>:<GraphView
        nodeSize={ 400 }
        ref={(el) => (this.GraphViewRef = el)}
        nodeKey={NODE_KEY}
        nodes={nodes}
        edges={edges}
        selected={selected}
        nodeTypes={NodeTypes}
        nodeSubtypes={NodeSubtypes}
        edgeTypes={EdgeTypes}
        onSelectNode={this.onSelectNode}
        onCreateNode={this.onCreateNode}
        onUpdateNode={this.onUpdateNode}
        onDeleteNode={this.onDeleteNode}
        onSelectEdge={this.onSelectEdge}
        onCreateEdge={this.onCreateEdge}
        onSwapEdge={this.onSwapEdge}
        onDeleteEdge={this.onDeleteEdge}
        onUndo={this.onUndo}
        onCopySelected={this.onCopySelected}
        onPasteSelected={this.onPasteSelected}
        layoutEngineType={ this.props.autolayout ? "VerticalTree" : undefined}
        renderNodeText={this.renderNodeText}
        renderNode={this.renderNode}
      />}


      </div>

      <button onClick={this.onSystemChange}>Change system</button>

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
      title: knot.name,
      type: TEXT_TYPE,
      x: x,
      y: y
    }
  }

  /**
   * Renders text for single node
   *
   * @param data node data
   * @param id node id
   * @param isSelected is node currently selected
   */
  private renderNodeText(data: INode, id: string | number, isSelected: boolean): JSX.Element {
    return <KnotText data={data} isSelected={isSelected} />
  }

  /**
   * Renders a node
   */
  private renderNode = (nodeRef: any, data: any, id: string, selected: boolean, hovered: boolean) => {
    const props = {
      height: 0,
      width: 0
    };

    const nodeShapeContainerClassName = GraphUtils.classNames('shape');
    let nodeClassName = GraphUtils.classNames('node', { selected, hovered });
    const nodeSubtypeClassName = GraphUtils.classNames('subtype-shape', { selected: this.state.selected });
    const nodeTypeXlinkHref = this.getNodeTypeXlinkHref(data, GraphConfig.NodeTypes) || '';
    const nodeSubtypeXlinkHref = this.getNodeSubtypeXlinkHref(data, GraphConfig.NodeSubtypes) || '';

    const defSvgNodeElement: any = nodeTypeXlinkHref ? document.querySelector(`defs>${nodeTypeXlinkHref}`) : null;
    const nodeWidthAttr = defSvgNodeElement ? defSvgNodeElement.getAttribute('width') : 0;
    const nodeHeightAttr = defSvgNodeElement ? defSvgNodeElement.getAttribute('height') : 0;
    props.width = nodeWidthAttr ? parseInt(nodeWidthAttr, 10) : props.width;
    props.height = nodeHeightAttr ? parseInt(nodeHeightAttr, 10) : props.height;
    const index = this.props.knots.findIndex((knot) => {
      return knot.id === id;
    });

    if (!!this.props.searchText && this.state.searchResultKnotIds.includes(id)) {
      nodeClassName += " search-hit";
    }

    return (
      <g className={nodeShapeContainerClassName} {...props}>
        {!!data.subtype && (
          <use
            data-index={index}
            className={nodeSubtypeClassName}
            x={-props.width / 2}
            y={-props.height / 2}
            width={props.width}
            height={props.height}
            xlinkHref={nodeSubtypeXlinkHref}
          />
        )}
        <use
          data-index={index}
          className={nodeClassName}
          x={-props.width / 2}
          y={-props.height / 2}
          width={props.width}
          height={props.height}
          xlinkHref={nodeTypeXlinkHref}
        />
      </g>
    );
  }


  /**
   * Resolves xlinkhref attribute for node
   *
   * @param data node
   * @param nodeTypes subtypes
   */
  private getNodeTypeXlinkHref(data: INode, nodeTypes: any) {
    if (data.type && nodeTypes[data.type]) {
      return nodeTypes[data.type].shapeId;
    } else if (nodeTypes.emptyNode) {
      return nodeTypes.emptyNode.shapeId;
    }
    return null;
  }

  /**
   * Resolves xlinkhref attribute for node subtype
   *
   * @param data node
   * @param nodeSubtypes subtypes
   */
  private getNodeSubtypeXlinkHref(data: INode, nodeSubtypes?: any) {
    if (data.subtype && nodeSubtypes && nodeSubtypes[data.subtype]) {
      return nodeSubtypes[data.subtype].shapeId;
    } else if (nodeSubtypes && nodeSubtypes.emptyNode) {
      return nodeSubtypes.emptyNode.shapeId;
    }
    return null;
  }

  /**
   * Helper to find the index of a given node
   *
   * @param searchNode node to find the index for
   */
  private getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex((node: INode) => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  //
  /**
   * Helper to find the index of a given edge
   *
   * @param searchEdge edge to find the index for
   */
  private getEdgeIndex(searchEdge: IEdge) {
    return this.state.graph.edges.findIndex((edge: IEdge) => {
      return edge.source === searchEdge.source && edge.target === searchEdge.target;
    });
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
   * Called by 'drag' handler, etc..
   * to sync updates from D3 with the graph
   */
  private onUpdateNode = (viewNode: INode) => {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState({ graph });
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
      title: "loading",
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

  /**
   * Called when an edge is reattached to a different target.
   */
  private onSwapEdge = async (sourceViewNode: INode, targetViewNode: INode, viewEdge: IEdge) => {
    const graph = this.state.graph;
    const intent = this.props.intents.find(intent => intent.id == viewEdge.id);
    if (!intent) {
      return;
    }

    intent.sourceKnotId = sourceViewNode.id;
    intent.targetKnotId = targetViewNode.id;
    const updatedIntent = await Api.getIntentsService(this.props.keycloak ? this.props.keycloak.token! : "").updateIntent(intent, this.props.storyId, intent.id!);
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    graph.edges = [...graph.edges];

    this.setState({
      graph,
      selected: edge
    });
    this.props.onIntentUpdated(updatedIntent);
  }

  /**
   * Event handler for edge deletion
   *
   * @param viewEdge edge
   * @param edges edges after deletion
   */
  private onDeleteEdge = async (viewEdge: IEdge, edges: IEdge[]) => {
    await this.deleteIntent(viewEdge.id);
    this.setState({
      selected: null
    });
  }

  /**
   * Event handler for node deletion
   *
   * @param viewNode node
   * @param nodeId node id
   * @param nodes nodes after deletion
   */
  private onDeleteNode = async (viewNode: INode, nodeId: string, nodes: INode[]) => {
    const graph = this.state.graph;
    const edges = [];

    for (let i = 0; i < graph.edges.length; i++) {
      const edge = graph.edges[i];

      if (edge.source[NODE_KEY] !== viewNode.id && edge.target[NODE_KEY] !== viewNode.id) {
        edges.push(edge);
      } else {
        await this.deleteIntent(edge.id);
      }
    }

    await Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "").deleteKnot(this.props.storyId, viewNode.id);


    this.props.onKnotDeleted(viewNode.id);
    this.setState({ selected: null });
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
