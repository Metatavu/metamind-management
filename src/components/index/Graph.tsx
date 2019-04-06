import * as React from 'react';

import { GraphView, IEdge, INode, LayoutEngineType } from 'react-digraph';
import Api, { Intent, Knot } from "metamind-client";
import GraphConfig, {
  NODE_KEY,
  TEXT_TYPE,
  OPENNLP_EDGE_TYPE,
  GLOBAL_TYPE
} from '../../utils/graph-config'; // Configures node/edge types

interface IGraph {
  nodes: INode[];
  edges: IEdge[];
};

interface Props {
  onSelectNode: (item: INode | null) => void,
  onSelectEdge: (item: IEdge | null) => void,
  storyId: string
};

interface State {
  graph: IGraph;
  selected: any;
  copiedNode: any;
  layoutEngineType?: LayoutEngineType;
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
      selected: null
    };

    this.GraphViewRef = React.createRef();
  }

  public async componentDidMount() {
    const knotsService = Api.getKnotsService("Not-a-real-token");
    const intentsService = Api.getIntentsService("Not-a-real-token");

    const [ knots, intents ] = await Promise.all([
      knotsService.listKnots(this.props.storyId),
      intentsService.listIntents(this.props.storyId)
    ]);

    const globalNode: INode = {
      id: GLOBAL_NODE_ID,
      title: "Global", // Localize
      type: GLOBAL_TYPE
    };

    this.setState({
      graph: {
        nodes: [ globalNode ].concat( knots.map(knot => this.translateKnot(knot)) ),
        edges: intents.map(intent => this.translateIntent(intent))
      }
    });
  }

  /*
   * Render
   */
  public render() {
    const { nodes, edges } = this.state.graph;
    const selected = this.state.selected;
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;

    return (
      <div id="graph" style={{width: "100vw", height: "100vh"}}>
        <GraphView
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
          layoutEngineType="VerticalTree"
        />
      </div>
    );
  }

  private translateIntent(intent: Intent): IEdge {
    return {
      id: intent.id,
      source: intent.global ? GLOBAL_NODE_ID : intent.sourceKnotId || "",
      target: intent.targetKnotId,
      type: OPENNLP_EDGE_TYPE
    }
  }

  private translateKnot(knot: Knot, x?: number, y?: number): INode {
    return {
      id: knot.id,
      title: knot.name,
      type: TEXT_TYPE,
      x: x,
      y: y
    }
  }

  // Helper to find the index of a given node
  getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex((node: INode) => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge: IEdge) {
    return this.state.graph.edges.findIndex((edge: IEdge) => {
      return edge.source === searchEdge.source && edge.target === searchEdge.target;
    });
  }

  // Given a nodeKey, return the corresponding node
  getViewNode(nodeKey: string) {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.state.graph.nodes[i];
  }

  /**
   * Deletes an intent
   */
  private deleteIntent = async (id: string) => {
    await Api.getIntentsService("not-real-token").deleteIntent(this.props.storyId, id);
  }

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = (viewNode: INode) => {
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

  // Updates the graph with a new node
  onCreateNode = async (x: number, y: number) => {
    const graph = this.state.graph;

    const knot = await Api.getKnotsService("not-real-token").createKnot({
      content: "New knot",
      name: "New knot",
      type: "TEXT"
    }, this.props.storyId);

    graph.nodes = [...graph.nodes, this.translateKnot(knot, x, y)];
    this.setState({ graph });
  }

  // Creates a new edge between two nodes
  onCreateEdge = async (sourceViewNode: INode, targetViewNode: INode) => {
    const graph = this.state.graph;
    const intent = await Api.getIntentsService("not-real-token").createIntent({
      type: "OPENNLP",
      name: "New intent",
      global: sourceViewNode.id === GLOBAL_NODE_ID,
      sourceKnotId: sourceViewNode.id === GLOBAL_NODE_ID ? undefined : sourceViewNode.id ,
      targetKnotId: targetViewNode.id
    }, this.props.storyId);

    const viewEdge = this.translateIntent(intent);

    graph.edges = [...graph.edges, viewEdge];
    this.setState({
      graph,
      selected: viewEdge
    });
  }

  // Called when an edge is reattached to a different target.
  onSwapEdge = (sourceViewNode: INode, targetViewNode: INode, viewEdge: IEdge) => {
    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference if you want the graph to re-render a swapped edge
    graph.edges = [...graph.edges];

    this.setState({
      graph,
      selected: edge
    });
  }

  /**
   * Event handler for edge deletion
   * 
   * @param viewEdge edge
   * @param edges edges after deletion
   */
  private onDeleteEdge = async (viewEdge: IEdge, edges: IEdge[]) => {
    await this.deleteIntent(viewEdge.id);

    const graph = this.state.graph;
    graph.edges = edges;
    this.setState({
      graph,
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

    await Api.getKnotsService("not-real-token").deleteKnot(this.props.storyId, viewNode.id);

    const edges = [];

    for (let i = 0; i < graph.edges.length; i++) {
      const edge = graph.edges[i];
      if (edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY]) {
        edges.push(edge);
      } else {
        await this.deleteIntent(edge.id);
      }
    }

    graph.nodes = nodes;
    graph.edges = edges;

    this.setState({ graph, selected: null });
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

export default Graph;
