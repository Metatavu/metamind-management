import * as React from "react";
import { useStoryEditorViewStyles } from "./story-editor-view";
import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { DefaultState } from "../../diagram-components/custom-state-machine/default-state";
import { CustomNodeFactory } from "../../diagram-components/custom-node/custom-node-factory";
import { HomeNodeFactory } from "../../diagram-components/home-node/home-node-factory";
import { CustomNodeModel } from "../../diagram-components/custom-node/custom-node-model";
import { HomeNodeModel } from "../../diagram-components/home-node/home-node-model";
import { Action, CanvasWidget, InputType } from '@projectstorm/react-canvas-core';
import CustomLinkFactory from "../../diagram-components/custom-link/custom-link-factory";
import { CustomLabelFactory } from "../../diagram-components/custom-label/custom-label-factory";
import CustomLinkModel from "../../diagram-components/custom-link/custom-link-model";
import { Intent, Knot } from "../../../generated/client";
import { Point } from "@projectstorm/geometry";

/**
 * Interface describing component props
 */
interface Props {
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
 *
 * @param props component properties
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
  const classes = useStoryEditorViewStyles();
  const [ newPoint, setNewPoint ] = React.useState<Point>();
  const [ movedNode, setMovedNode ] = React.useState<CustomNodeModel | HomeNodeModel>();
  const [ initialized, setInitialized ] = React.useState(false);

  const engineRef = React.useRef(createEngine());
  const debounceTimer = React.useRef<NodeJS.Timeout>();

  /**
   * Effect that initializes diagram and adds initial data to it when component mounts
   */
  React.useEffect(() => {
    initializeEngine();
    addInitialData();
    // eslint-disable-next-line
  }, []);

  /**
   * Effect that syncs knots to diagram nodes when length of knots list is changed
   */
  React.useEffect(() => {
    const engine = engineRef.current;
    const nodes = engine.getModel().getNodes();

    nodes.forEach(node => knots.every(knot => knot.id !== node.getID()) && engine.getModel().removeNode(node));
    knots.forEach(knot => nodes.every(node => node.getID() !== knot.id) && engine.getModel().addNode(translateToNode(knot)));

    engine.repaintCanvas();
    // eslint-disable-next-line
  }, [ knots.length ]);

  /**
   * Effect that creates new node when diagram is clicked and addingKnots is true
   */
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

  /**
   * Effect that delays actual update of coordinates in knot when corresponding node is moved in diagram
   */
  React.useEffect(() => {
    debounceTimer.current && clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => moveNode(), 1000);
    // eslint-disable-next-line
  }, [ movedNode ]);

  /**
   * Initializes react-diagrams engine
   *
   * @param engine diagram engine
   */
  const initializeEngine = () => {
    const engineState = new DefaultState();
    engineState.registerAction(
      new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: any) => setNewPoint(engineRef.current.getRelativeMousePoint(event.event))
			})
    );

    const diagramModel: DiagramModel = new DiagramModel();
    diagramModel.registerListener({
      linksUpdated: ({ link }: any) => {
        link.registerListener({
          targetPortChanged: ({ port }: any) => {
            onAddLink(
              link.getSourcePort().getParent().getID(),
              port.getParent().getID()
            );
          },
          entityRemoved: ({ entity }: any) => {
            entity.getID() && onRemoveLink(entity.getID());
          }
        });
      }
    });

    engineRef.current.getStateMachine().pushState(engineState);
    engineRef.current.getNodeFactories().registerFactory(new CustomNodeFactory());
    engineRef.current.getNodeFactories().registerFactory(new HomeNodeFactory());
    engineRef.current.getLinkFactories().registerFactory(new CustomLinkFactory());
    engineRef.current.getLabelFactories().registerFactory(new CustomLabelFactory());
    engineRef.current.setModel(diagramModel);

    setInitialized(true);
  }

  /**
   * Translates knot to node
   *
   * @param knot knot
   * @returns node model
   */
  const translateToNode = (knot: Knot) => {
    const node = new CustomNodeModel({ name: knot.name, id: knot.id });
    node.setPosition(knot.coordinates?.x || 200, knot.coordinates?.y || 200);
    return addNodeListeners(node);
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
      positionChanged: ({ entity }: any) => {
        setMovedNode(entity as CustomNodeModel);
      },
      entityRemoved: ({ entity }: any) => {
        onRemoveNode(entity.getID() as string);
      }
    });

    return node;
  }

  /**
   * Translates intent to link
   *
   * @param intent intent
   * @param nodes list of nodes
   * @returns custom link model
   */
  const translateToLink = (intent: Intent, nodes: CustomNodeModel[]) => {
    const sourceNode = nodes.find(node => node.getID() === intent.sourceKnotId);
    const targetNode = nodes.find(node => node.getID() === intent.targetKnotId);

    if (!sourceNode || !targetNode) {
      return;
    }

    const link = new CustomLinkModel({ id: intent.id });

    link.setSourcePort(sourceNode.getOutPorts()[0]);
    link.setTargetPort(targetNode.getInPorts()[0]);

    return link;
  }

  /**
   * Adds initial knot data
   */
  const addInitialData = () => {
    const nodes = knots.map(translateToNode);
    const links = intents.reduce<CustomLinkModel[]>((links, intent) => {
      const translatedLink = translateToLink(intent, nodes);
      return translatedLink ? [ ...links, translatedLink ] : links
    }, []);

    engineRef.current.getModel().addAll(...nodes, ...links);
  }

  /**
   * Event handler for node move
   */
  const moveNode = () => {
    if (movedNode) {
      const id = movedNode.getID();
      const foundKnot = knots.find(knot => knot.id === id);
      onMoveNode(movedNode, foundKnot);
    }
  }

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

export default StoryEditorView;