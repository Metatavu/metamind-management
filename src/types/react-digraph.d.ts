/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

declare module "react-digraph" {

  export interface INode {
    title: string;
    x?: number | null;
    y?: number | null;
    type?: string;
    subtype?: string | null;
    [key: string]: any;
  }

  export interface IPoint {
    x: number;
    y: number;
  }

  export interface INodeProps {
    data: INode;
    id: string;
    nodeTypes: any; // TODO: make a nodeTypes interface
    nodeSubtypes: any; // TODO: make a nodeSubtypes interface
    opacity?: number;
    nodeKey: string;
    nodeSize?: number;
    onNodeMouseEnter: (event: any, data: any, hovered: boolean) => void;
    onNodeMouseLeave: (event: any, data: any) => void;
    onNodeMove: (point: IPoint, id: string, shiftKey: boolean) => void;
    onNodeSelected: (data: any, id: string, shiftKey: boolean) => void;
    onNodeUpdate: (point: IPoint, id: string, shiftKey: boolean) => void;
    renderNode?: (
      nodeRef: any,
      data: any,
      id: string,
      selected: boolean,
      hovered: boolean,
    ) => any;
    renderNodeText?: (
      data: any,
      id: string | number,
      isSelected: boolean,
    ) => any;
    isSelected: boolean;
    layoutEngine?: any;
    viewWrapperElem: HTMLDivElement;
  }

  export const Node: React.ComponentClass<INodeProps>;

  export interface IEdge {
    source: string;
    target: string;
    type?: string;
    handleText?: string;
    [key: string]: any;
  }

  export interface ITargetPosition {
    x: number;
    y: number;
  }

  export interface IEdgeProps {
    data: IEdge;
    edgeTypes: any; // TODO: create an edgeTypes interface
    edgeHandleSize?: number;
    nodeSize?: number;
    sourceNode: INode | null;
    targetNode: INode | ITargetPosition;
    isSelected: boolean;
    nodeKey: string;
    viewWrapperElem: HTMLDivElement;
  }

  export const Edge: React.Component<IEdgeProps>;

  export interface IGraphViewProps {
    backgroundFillId?: string;
    edges: any[];
    edgeArrowSize?: number;
    edgeHandleSize?: number;
    edgeTypes: any;
    gridDotSize?: number;
    gridSize?: number;
    gridSpacing?: number;
    layoutEngineType?: LayoutEngineType;
    maxTitleChars?: number;
    maxZoom?: number;
    minZoom?: number;
    nodeKey: string;
    nodes: any[];
    nodeSize?: number;
    nodeSubtypes: any;
    nodeTypes: any;
    readOnly?: boolean;
    selected: any;
    showGraphControls?: boolean;
    zoomDelay?: number;
    zoomDur?: number;
    canCreateEdge?: (startNode?: INode, endNode?: INode) => boolean;
    canDeleteEdge?: (selected: any) => boolean;
    canDeleteNode?: (selected: any) => boolean;
    onCopySelected?: () => void;
    onCreateEdge: (sourceNode: INode, targetNode: INode) => void;
    onCreateNode: (x: number, y: number) => void;
    onDeleteEdge: (selectedEdge: IEdge, edges: IEdge[]) => void;
    onDeleteNode: (selected: any, nodeId: string, nodes: any[]) => void;
    onPasteSelected?: () => void;
    onSelectEdge: (selectedEdge: IEdge) => void;
    onSelectNode: (node: INode | null) => void;
    onSwapEdge: (sourceNode: INode, targetNode: INode, edge: IEdge) => void;
    onUndo?: () => void;
    onUpdateNode: (node: INode) => void;
    renderBackground?: (gridSize?: number) => any;
    renderDefs?: () => any;
    renderNode?: (
      nodeRef: any,
      data: any,
      id: string,
      selected: boolean,
      hovered: boolean,
    ) => any;
    afterRenderEdge?: (
      id: string,
      element: any,
      edge: IEdge,
      edgeContainer: any,
      isEdgeSelected: boolean,
    ) => void;
    renderNodeText?: (
      data: any,
      id: string | number,
      isSelected: boolean,
    ) => any;
  }

  export interface IGraphInput {
    nodes: INode[];
    edges: IEdge[];
  }

  export class BwdlTransformer extends Transformer {}

  export class Transformer {
    /**
     * Converts an input from the specified type to IGraphInput type.
     * @param input
     * @returns IGraphInput
     */
    public static transform(input: any): IGraphInput;

    /**
     * Converts a graphInput to the specified transformer type.
     * @param graphInput
     * @returns any
     */
    public static revert(graphInput: IGraphInput): any;
  }

  export type LayoutEngineType = "None" | "SnapToGrid" | "VerticalTree";

  export const GraphView: React.ComponentClass<IGraphViewProps>;
  export interface INodeMapNode {
    node: INode;
    originalArrIndex: number;
    incomingEdges: IEdge[];
    outgoingEdges: IEdge[];
    parents: INode[];
    children: INode[];
  }

  interface ObjectMap<T> { [key: string]: T }

  export type NodesMap = ObjectMap<INodeMapNode>;

  export type EdgesMap = ObjectMap<IEdgeMapNode>;

  export interface IEdgeMapNode {
    edge: IEdge;
    originalArrIndex: number;
  }

  export type Element = any;

  export class GraphUtils {
    public static getNodesMap(arr: INode[], key: string): NodesMap;

    public static getEdgesMap(arr: IEdge[]): EdgesMap;

    public static linkNodesAndEdges(nodesMap: NodesMap, edges: IEdge[]): void;

    public static removeElementFromDom(id: string): boolean;

    public static findParent(element: Element, selector: string): Element | null;

    public static classNames(...args: any[]): string;

    public static yieldingLoop(
      count: number,
      chunksize: number,
      callback: (i: number) => void,
      finished?: () => void,
    ): void;

    public static hasNodeShallowChanged(prevNode: INode, newNode: INode): boolean;
  }
}
