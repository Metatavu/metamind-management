import * as React from "react";
import * as dagre from "dagre";
import GraphConfig from '../../utils/graph-config';
export interface INode{
  id:string,
  title:string,
  x:number,
  y:number,
  type?:string,
  subtype?:string
}
export interface IEdge{
  id:string,
  source:INode,
  target:INode
}
interface Props{
  width:number,
  height:number,
  nodes:INode[],
  edges:IEdge[],
  autolayout:boolean,
  filterIds:string[],
  searchText:string,
  onNodeClick:(viewNode:INode)=>void,
  onNodeDragEnd:(viewNode:INode)=>void,
  onCreateNode:(viewNode:INode)=>void,
  onDeleteNode:(viewNode:INode)=>Promise<void>,
  onCreateEdge:(targetViewNode:INode,sourceViewNode:INode)=>Promise<void>,
  onDeleteEdge:(viewEdge:IEdge)=>Promise<void>,
  onEdgeClick:(viewEdge:IEdge)=>void,
  onUpdateMultiple:(viewNodes:INode[])=>Promise<void>
}
interface State{

  beingDragged?:INode,
  nodes:INode[],
  edges:IEdge[],
  selectedNode?:INode,
  selectedEdge?:IEdge,
  zoom:number,
  translateX:number,
  translateY:number,
  filterIds:string[],
  autolayout:boolean
}

class GraphView extends React.Component<Props,State>{
  constructor(props:Props){
    super(props);
    this.state = {
      nodes:[],
      edges:[],
      zoom:1,
      translateX:0,
      translateY:0,
      filterIds:[],
      autolayout:true
    };
  }
  //Get called when props change
  static getDerivedStateFromProps = (props: Props, state: State) => {
    const newNodes = props.nodes.map(node=>{


      return {...node,x:props.width/2+node.x,y:props.height/2+node.y};
    });
    const newEdges = props.edges.map(edge=>{
      const sourceX = props.width/2+edge.source.x;
      const sourceY = props.height/2+edge.source.y;
      const targetX = props.width/2+edge.target.x;
      const targetY = props.height/2+edge.target.y;
      const source = {...edge.source,x:sourceX,y:sourceY};
      const target = {...edge.target,x:targetX,y:targetY};
      return {...edge,target,source};
    });
    let selectedEdge=state.selectedEdge;
    let selectedNode=state.selectedNode;
    if(props.filterIds.length>0){
      selectedEdge=undefined;
      selectedNode=undefined
    };
    return {nodes:newNodes,edges:newEdges,filterIds:props.filterIds,selectedEdge,selectedNode};
  }

  componentDidMount(){
    //Sets the key handler for events
    this.keyHandler();
  }

  render(){
    //Resets the layout when the "layout automatically"-button gets pressed
    if(this.state.autolayout!==this.props.autolayout){
      this.setLayout();
    }


    return(
      <div id="GraphView">
      <svg width={this.props.width} onMouseMove={this.handleDrag} onMouseUp={this.svgMouseUpHandler} onClick={this.svgClickHandler} onWheel={this.zoomHandler} height={this.props.height}>

      {this.getGraph()}
      </svg>
      </div>
    );
  }
  //Gets all graphical elements of the graph
  getGraph = ():any[] => {
    const edgeLines = this.state.edges.map(edge=>this.getEdgeLines(edge));
    const edgeCircles = this.state.edges.map(edge=>this.getEdgeCircles(edge));
    const edgeArrows = this.state.edges.map(edge=>this.getEdgeArrows(edge));
    const nodeIcons = this.state.nodes.map(node=>this.getNodeIcons(node));
    return edgeLines.concat(edgeCircles).concat(nodeIcons).concat(edgeArrows);
  }
  //Gets the lines that represent edges between nodes
  getEdgeLines = (edge:IEdge) => {
    const color = this.giveColor(edge,this.state.selectedEdge);
    const x1 = this.getElementPosition(edge.source.x);
    const x2 = this.getElementPosition(edge.target.x);
    const y1 = this.getElementPosition(undefined,edge.source.y);
    const y2 = this.getElementPosition(undefined,edge.target.y);

    return <line  onClick={()=>this.edgeClickHandler(edge)} x1={x1} x2={x2} y1={y1} y2={y2} style={{"stroke":color}} stroke-width={2}></line>
  }
  getEdgeArrows = (edge:IEdge) =>{

    const x = this.getElementPosition((((edge.source.x*0.5)+(edge.target.x*1.5)))/2);
    const y = this.getElementPosition(undefined,(((edge.source.y*0.5)+(edge.target.y*1.5)))/2);
    const rotation = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x) * 180 / Math.PI;
    const arrowTransform = `translate(${x},${y}) rotate(${rotation})`;
    const color = this.giveColor(edge,this.state.selectedEdge);
    return <polygon onClick={()=>this.edgeClickHandler(edge)} fill={color} transform={arrowTransform} points={`${-5*this.state.zoom}, ${-5*this.state.zoom} ${5*this.state.zoom},0 ${-5*this.state.zoom} , ${5*this.state.zoom} ${-3*this.state.zoom},0` }/>;

  }
  //Gets the clickable circles on top of the edges
  getEdgeCircles = (edge:IEdge)=>{
    const color = this.giveColor(edge,this.state.selectedEdge);
    const x = this.getElementPosition(((edge.source.x+edge.target.x))/2);
    const y = this.getElementPosition(undefined,((edge.source.y+edge.target.y))/2);
    const circleTransform = `translate(${x},${y})`;


    return <circle onClick={()=>this.edgeClickHandler(edge)} transform={circleTransform}  fill={color} r={5*this.state.zoom} ></circle>
  }
  //Gets the node icons
  getNodeIcons = (node:INode)=>{
    const color = this.giveColor(node,this.state.selectedNode);
    const transform = ()=>{

      let {x,y} = this.getElementPosition(node.x,node.y);
      if(this.state.beingDragged){
        if(this.state.beingDragged.id===node.id){
          x=this.getElementPosition(this.state.beingDragged.x);
          y=this.getElementPosition(undefined,this.state.beingDragged.y);
        }
      }
      return `translate(${x-(16*this.state.zoom)},${y-(16*this.state.zoom)})`;
    }


    const nodetypes = GraphConfig.NodeTypes;
    const textShape = nodetypes.text.shape;
    const globalShape = nodetypes.global.shape;
    let shape = textShape(25*this.state.zoom,25*this.state.zoom,color);
    if(node.id==="GLOBAL"){
      shape=globalShape(25*this.state.zoom,25*this.state.zoom,color);
    }
    return <g  onMouseDown={()=>this.nodeMouseDownHandler(node)} onContextMenu={(event)=>{event.preventDefault();this.nodeRightClickHandler(node)}} onClick={(event)=>this.nodeClickHandler(event,node)} transform={transform()} >{shape}</g>
  }
  //Resets the layout
  setLayout = () => {
    this.setState({autolayout:this.props.autolayout});
    let newNodes:any = [];
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(function() { return {}; });
    this.state.nodes.forEach(node=>{
      g.setNode(node.id,{id:node.id});
    });
    this.state.edges.forEach(edge=>{
      g.setEdge(edge.source.id,edge.target.id);
    });
    dagre.layout(g);
    g.nodes().forEach(n=>{
      newNodes.push({id:g.node(n).id,x:g.node(n).x,y:g.node(n).y});
    });

    this.props.onUpdateMultiple(newNodes);
  }
  //Handles dragging nodes
  handleDrag = (event:any) => {
    const svg = event.currentTarget;

    if(this.state.beingDragged){
      console.log("Dragged");
        const {x,y} = this.getMousePosition(svg,event.clientX+event.movementX,event.clientY+event.movementY);
        this.setState({beingDragged:{...this.state.beingDragged,x,y}});

    }
  };
  //Deletes all edges that are connected to the node
  deleteConnectedEdges = async (node:INode) => {
    const promises = this.state.edges.map(async(edge)=>{
      if(edge.source.id===node.id||edge.target.id===node.id){
        await this.props.onDeleteEdge(edge);
      }
    });
    await Promise.all(promises);


  }
  //Handles edge selection
  edgeClickHandler = (edge:IEdge) => {
      this.props.onEdgeClick(edge);
      this.setState({selectedEdge:edge});
      this.setState({selectedNode:undefined});

    }
    //Gives a color to a node or edge
    giveColor = (d:IEdge|INode,selected:IEdge|INode|undefined) => {
      if(selected){

        if(selected.id===d.id){
          return "red";
        }
      }
      if(this.props.filterIds.includes(d.id)){
        return "green";
      }
      return "blue";
    }
    //Handles selecting nodes
    nodeClickHandler = (event:any,node:INode) => {
      if(!event.shiftKey){
        this.props.onNodeClick(node);
        this.setState({selectedNode:node});
        this.setState({selectedEdge:undefined});

      }
    }
    //Node can be dragged only if this function gets calle
    nodeMouseDownHandler = (node:INode) => {

      if(!this.state.beingDragged){
              this.setState({beingDragged:node});
      }
    }
    //Handles creating new edges
    nodeRightClickHandler = (node:INode) => {


      if(this.state.selectedNode){
        let alreadyExists = false;
        for(let i=0;i<this.state.edges.length;i++){
          if(this.state.edges[i].source.id===this.state.selectedNode.id&&this.state.edges[i].target.id===node.id){
            alreadyExists = true;
          }
        }
        if(!alreadyExists){
          if(node.id!==this.state.selectedNode.id){
            const newEdge = {id:Date.now().toString(),source:this.state.selectedNode,target:node};
            this.props.onCreateEdge(newEdge.source,newEdge.target);
            const edges = this.state.edges;
            edges.push(newEdge);
            this.setState({edges});
        }
        }
      }
    }
    //Handles key events
    keyHandler = () => {
      window.addEventListener("keydown",(event:any)=>{
        //Up arrow
        if(event.keyCode===38){
          let translateY = this.state.translateY;
          translateY+=(10/this.state.zoom);
          this.setState({translateY});

        }
        //Down arrow
        if(event.keyCode===40){
          let translateY = this.state.translateY;
          translateY-=(10/this.state.zoom);
          this.setState({translateY});

        }
        //Left arrow
        if(event.keyCode===37){
          let translateX = this.state.translateX;
          translateX+=(10/this.state.zoom);
          this.setState({translateX});

        }
        //Right arrow
        if(event.keyCode===39){
          let translateX = this.state.translateX;
          translateX-=(10/this.state.zoom);
          this.setState({translateX});

        }
        //Delete-key
        if(event.keyCode===46){
          if(this.state.selectedNode){
            const newNodes = this.state.nodes.filter(node=>{
              if(this.state.selectedNode){
                if(node.id===this.state.selectedNode.id){
                    this.deleteConnectedEdges(node).then(()=>{
                                        this.props.onDeleteNode(node);
                    });
                  return false;
                }
                return true;
              }
              return true;
            });

            this.setState({selectedNode:undefined,nodes:newNodes});
          }
          if(this.state.selectedEdge){
            const newEdges = this.state.edges.filter(edge=>{
              if(this.state.selectedEdge){
                if(edge.id===this.state.selectedEdge.id){
                  this.props.onDeleteEdge(edge);
                  return false;
                }
              }
              return true;
            })
            this.setState({selectedEdge:undefined,edges:newEdges});
          }

        }

      });
    }
  //Gets mouse position in relation to svg
  getMousePosition = (svg:any,eventX:number,eventY:number):any => {
    const rect = svg.getBoundingClientRect();
    const x = eventX -rect.left-svg.clientLeft-window.pageXOffset-this.state.translateX;
    const y = eventY -rect.top-svg.clientTop-window.pageYOffset-this.state.translateY;
    const distanceFromCenterX = x-(this.props.width/2)+this.state.translateX;
    const distanceFromCenterY = y-(this.props.height/2)+this.state.translateY;
    return {x:x+(distanceFromCenterX/this.state.zoom-distanceFromCenterX),y:y+(distanceFromCenterY/this.state.zoom-distanceFromCenterY)};
  }
  //Gets element position with zoom and translate values taken into account
  getElementPosition = (inputX?:number,inputY?:number):any => {
    let finalX:number|undefined=undefined;
    let finalY:number|undefined=undefined;
    if(inputX){
      const x = inputX+(this.state.translateX/this.state.zoom);
      const distanceFromCenterX = x-(this.props.width/2)+this.state.translateX;
      finalX = x+(distanceFromCenterX*this.state.zoom-distanceFromCenterX);
    }
    if(inputY){
      const y = inputY+(this.state.translateY/this.state.zoom);
      const distanceFromCenterY = y-(this.props.height/2)+this.state.translateY;
      finalY = y+(distanceFromCenterY*this.state.zoom-distanceFromCenterY);
    }
    if(finalX&&finalY){
      return {x:finalX,y:finalY};
    }
    if(finalX){
      return finalX;
    }
    if(finalY){
      return finalY;
    }
  }
  //Handles zooming
  zoomHandler = (event:any) => {
    const deltaY = event.deltaY;
    let {zoom}= this.state;
    if(deltaY>0){
      zoom/=1.5;
      this.setState({zoom});
    }
    if(deltaY<0){
      zoom*=1.5;
      this.setState({zoom});
    }

  }
  //Saves the final position after dragging a node.
  svgMouseUpHandler = () => {
    if(this.state.beingDragged){
      let x = this.state.beingDragged.x;
      let y = this.state.beingDragged.y;

        x -= (this.props.width/2);
        y -= (this.props.height/2);

        const nodes = this.state.nodes.map(node=>{
          if(this.state.beingDragged){
            if(node.id===this.state.beingDragged.id){
              return this.state.beingDragged;
            }
          }
          return node;
        });

        const sendNode =this.state.beingDragged;
        this.props.onNodeDragEnd({...sendNode,x,y});
        this.setState({beingDragged:undefined,nodes});


    }
  }
  //Handles the creation of new nodes.
  svgClickHandler = (event:any) => {

    if(event.shiftKey){
      const svg = event.currentTarget;
      const {x,y} = this.getMousePosition(svg,event.clientX,event.clientY);
      const newNode = {id:Date.now().toString(),title:"New Knot",x,y};
      this.props.onCreateNode({...newNode,x:x-(this.props.width/2),y:y-(this.props.height/2)});
      const nodes = this.state.nodes;
      nodes.push(newNode);
      this.setState({nodes});

    }
  }


}
export default GraphView;
