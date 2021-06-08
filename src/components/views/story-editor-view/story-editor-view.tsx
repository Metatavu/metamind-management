import { makeStyles, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { styles } from "./story-editor-view";
import createEngine, {  DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';
import { DefaultState } from "../../diagram-components/custom-state-machine/default-state";
import { CustomNodeFactory } from "../../diagram-components/custom-node/custom-node-factory";
import { CustomNodeModel } from "../../diagram-components/custom-node/custom-node-model";
import { Action, ActionEvent, CanvasWidget, InputType } from '@projectstorm/react-canvas-core';
import CustomLinkFactory from "../../diagram-components/custom-link/custom-link-factory";
import { CustomLabelFactory } from "../../diagram-components/custom-label/custom-label-factory";
import { Intent, Knot } from "../../../generated/client";
import { Point } from "@projectstorm/geometry";
import CustomLinkModel from "../../diagram-components/custom-link/custom-link-model";
import { CustomPortModel } from "../../diagram-components/custom-port/custom-port-model";

const useLocalStyles = makeStyles({
  canvas: {
    height: "100vh"
  }
});

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  knots: Knot[];
  intents: Intent[];
  addingKnots: boolean;
  onAddNode: (node: CustomNodeModel) => void;
  onMoveNode: (node: CustomNodeModel, knot?: Knot) => void;
  onRemoveNode: (nodeId: string) => void;
  onAddLink: (sourceNodeId: string, targetNodeId: string) => void;
  onRemoveLink: (linkId: string) => void;
}

/**
 * Functional story editor component
 */
const StoryEditorView: React.FC<Props> = ({
  knots,
  intents,
  addingKnots,
  onAddNode,
  onMoveNode,
  onRemoveNode,
  onAddLink,
  onRemoveLink
}) => {

  const classes = useLocalStyles();
  const [ newPoint, setNewPoint ] = React.useState<Point>();
  const [ movedNode, setMovedNode ] = React.useState<CustomNodeModel>();
  const [ initialized, setInitialized ] = React.useState(false);

  const engineRef = React.useRef(createEngine());
  const debounceTimer = React.useRef<NodeJS.Timeout>();

  /**
   * Initializes react-diagrams engine
   */
  const initializeEngine = (engine: DiagramEngine) => {

    const engineState = new DefaultState();
    engineState.registerAction(
      new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<any>) => {
          const { clientX, clientY } = event.event;
          const mousePoint = engine.getRelativeMousePoint({
            clientX: clientX,
            clientY: clientY
          });

          setNewPoint(mousePoint);
        }
			})
    );

    const diagramModel: DiagramModel = new DiagramModel();
    diagramModel.registerListener({
      linksUpdated: (linkUpdateEvent: any) => {
        const link = linkUpdateEvent.link as CustomLinkModel;
        const linkSourceNode = link.getSourcePort().getParent() as CustomNodeModel;

        link.registerListener({
          targetPortChanged: (portChangedEvent: any) => {
            const port = portChangedEvent.port as CustomPortModel;
            const linkTargetNode = port.getParent() as CustomNodeModel;
            onAddLink(linkSourceNode.getID(), linkTargetNode.getID());
          },
          entityRemoved: (entityRemovedEvent: any) => {
            const removedLink = entityRemovedEvent.entity as CustomLinkModel;
            const linkId = removedLink.getID();
            if (linkId) {
              onRemoveLink(removedLink.getID());
            }
          }
        });
      }
    });

    engine.getStateMachine().pushState(engineState);
    engine.getNodeFactories().registerFactory(new CustomNodeFactory());
    engine.getLinkFactories().registerFactory(new CustomLinkFactory());
    engine.getLabelFactories().registerFactory(new CustomLabelFactory());
    engine.setModel(diagramModel);

    setInitialized(true);
  }

  /**
   * Creates nodes from knots
   */
  const createNodes = () => {
    return knots.map(knot => {
      const node = new CustomNodeModel({ name: knot.name, id: knot.id });
      node.setPosition(knot.coordinates?.x || 200, knot.coordinates?.y || 200);

      return addNodeListeners(node);
    })
  }

  /**
   * Adds node listeners
   *
   * @param node node
   * @returns node with event handlers
   */
  const addNodeListeners = (node: CustomNodeModel) => {
    node.registerListener({
      selectionChanged: (selectionChangedEvent: any) => {
        console.log("TODO");
      },
      positionChanged: (positionChangeEvent: any) => {
        const eventNode = positionChangeEvent.entity as CustomNodeModel;
        setMovedNode(eventNode);
      },
      entityRemoved: (entityRemovedEvent: any) => {
        const removedNode = entityRemovedEvent.entity as CustomNodeModel;
        onRemoveNode(removedNode.getID());
      }
    });

    return node;
  }

  /**
   * Creates links
   *
   * @param nodes list of nodes
   * @returns list of custom link models
   */
  const createLinks = (nodes: CustomNodeModel[]) => {
    const links: CustomLinkModel[] = [];
    intents.forEach(intent => {
      const sourceNode = nodes.find(node => node.getID() === intent.sourceKnotId);
      const targetNode = nodes.find(node => node.getID() === intent.targetKnotId);

      if (sourceNode && targetNode) {
        const link = new CustomLinkModel({ id: intent.id });

        const sourcePort = sourceNode.getOutPorts()[0];
        const targetPort = targetNode.getInPorts()[0];

        link.setSourcePort(sourcePort);
        link.setTargetPort(targetPort);
        links.push(link);
      }
    });

    return links;
  }

  /**
   * Adds initial knot data
   */
  const addInitialData = () => {
    const nodes = createNodes();
    const links = createLinks(nodes);
    engineRef.current.getModel().addAll(...nodes, ...links);
  }

  /**
   * Event handler for node move
   */
  const moveNode = () => {
    if (movedNode) {
      const id = movedNode.getID();
      const knot = knots.find(_knot => _knot.id === id);
      onMoveNode(movedNode, knot);
    }
  }

  /**
   * Event handler for adding changed nodes to engine
   */
  const addChangedNodes = () => {
    console.log("TODO");
  }

  React.useEffect(() => {
    initializeEngine(engineRef.current);
    addInitialData();
  }, []);

  React.useEffect(() => {
    addChangedNodes();
  }, [ knots ]);

  React.useEffect(() => {
    if (!addingKnots) {
      setNewPoint(undefined);
      return;
    }

    if (newPoint && engineRef.current) {
      const node = new CustomNodeModel({ name: "New node" });
      node.setPosition(newPoint.x, newPoint.y);
      engineRef.current.getModel().addNode(node);

      setNewPoint(undefined);
      onAddNode(node);
    }
  }, [ addingKnots, newPoint, onAddNode ]);

  React.useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => moveNode(), 1000);
  }, [ movedNode ]);

  /**
   * Component render
   */
  return (
    <div style={{ width: "100%", height: "100%" }}>
      { initialized && engineRef.current &&
        <CanvasWidget className={ classes.canvas } engine={ engineRef.current } />
      }
    </div>
  );
}

export default withStyles(styles)(StoryEditorView);