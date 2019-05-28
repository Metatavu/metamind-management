import * as React from "react";
import * as d3 from "d3";

export interface INode{
  id:string,
  title:string,
  x:number,
  y:number,
  type?:string
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
  filterIds:string[],
  onNodeClick:(viewNode:INode)=>void,
  onNodeDragEnd:(viewNode:INode)=>void,
  onCreateNode:(viewNode:INode)=>void,
  onDeleteNode:(viewNode:INode)=>Promise<void>,
  onCreateEdge:(targetViewNode:INode,sourceViewNode:INode)=>Promise<void>,
  onDeleteEdge:(viewEdge:IEdge)=>Promise<void>,
  onEdgeClick:(viewEdge:IEdge)=>void
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
  dragged:boolean,
  filterIds:string[],
  filterIdsOld:string[]
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
      dragged:false,
      filterIds:[],
      filterIdsOld:[]
    };
  }

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
    return {nodes:newNodes,edges:newEdges,filterIds:props.filterIds};
  }
  componentDidMount(){
    this.setSvg();
    this.keyHandler();

  }

  render(){

    if(this.state.filterIdsOld!==this.state.filterIds){
      this.setState({filterIdsOld:this.state.filterIds,selectedEdge:undefined,selectedNode:undefined});
        this.setSvg();

    }

    return(
      <div id="GraphView"></div>
    );
  }
  setSvg = () => {
    //Rendering svg

    d3.select("svg").remove();
    const svg = d3.select("#GraphView")
    .append("svg")
    .attr("width",this.props.width)
    .attr("height",this.props.height)
    .attr("class","graph-svg")
    .on("wheel",this.zoomHandler)
    .on("mouseup",()=>this.svgMouseUpHandler(svg))
    .on("click",()=>this.svgClickHandler(svg));
    //Rendering edges
    const edges = this.state.edges;
    svg.selectAll(".link")
    .data(edges)
    .enter()
    .append("line")
    .attr("stroke-width", 2)
    .style("stroke",d=>this.giveColor(d,this.state.selectedEdge))
    .attr("x1",d=>(this.getElementPosition(d.source.x)))
    .attr("x2",d=>(this.getElementPosition(d.target.x)))
    .attr("y1",d=>(this.getElementPosition(undefined,d.source.y)))
    .attr("y2",d=>(this.getElementPosition(undefined,d.target.y)))
    .on("click",d=>this.edgeClickHandler(d));

    svg.selectAll(".link")
    .data(edges)
    .enter().append("circle").attr("r",window.innerWidth*0.007*this.state.zoom)
    .attr("fill",d=>this.giveColor(d,this.state.selectedEdge))
    .attr("transform", (d:any) =>{
        const x = this.getElementPosition(((d.source.x*0.5)+(d.target.x*1.5))/2);
        const y = this.getElementPosition(undefined,((d.source.y*0.5)+(d.target.y*1.5))/2);
        return `translate(${x},${y})`;
    })
    .on("click",d=>this.edgeClickHandler(d));

    //Rendering nodes
    const nodes = this.state.nodes;
    const node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r",d=>d.id==="GLOBAL"?window.innerWidth*0.025*this.state.zoom:window.innerWidth*0.015*this.state.zoom)
    .attr("transform", (d:any) =>{
      const {x,y} = this.getElementPosition(d.x,d.y);
      return `translate(${x},${y})`;
    })
    .style("fill", d=> this.giveColor(d,this.state.selectedNode))
    .on("click",d=>this.nodeClickHandler(d))
    .on("mousedown",d=>this.nodeMouseDownHandler(d))
    .on("contextmenu",(d)=>this.nodeRightClickHandler(d));

    svg.on("mousemove",()=>this.handleDrag(svg,node));
  }
  handleDrag = (svg:any,node:any) => {
    if(this.state.beingDragged){
        const {x,y} = this.getMousePosition(svg.node(),d3.event.clientX+d3.event.movementX,d3.event.clientY+d3.event.movementY);
        node.attr("cx", (d:any) =>{
          if(this.state.beingDragged){
            if(d.id===this.state.beingDragged.id){
              d.x = x;
              return x;
            }
            return d.x;
          }
          return d.x;

        }).attr("cy", (d:any) =>{
          if(this.state.beingDragged){
            if(d.id===this.state.beingDragged.id){
              d.y = y;
              return y;
            }
            return d.y;
          }
          return d.y;
        });
        this.setSvg();
    }
  }
  deleteConnectedEdges = async (node:INode) => {
      const edges = this.state.edges.map(async (edge)=>{
        if(edge.source.id===node.id||edge.target.id===node.id){
          await this.props.onDeleteEdge(edge);


        }
      });
      await Promise.all(edges);




  }

  edgeClickHandler = (d:IEdge) => {
      this.props.onEdgeClick(d);
      this.setState({selectedEdge:d});
      this.setState({selectedNode:undefined});
      this.setSvg();
    }
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
    nodeClickHandler = (d:INode) => {
      if(!d3.event.shiftKey){
        this.props.onNodeClick(d);
        this.setState({selectedNode:d});
        this.setState({selectedEdge:undefined});
        this.setSvg();
      }
    }
    nodeMouseDownHandler = (d:INode) => {
      if(!this.state.beingDragged){
              this.setState({beingDragged:d});
      }
    }
    nodeRightClickHandler = (d:INode) => {
      d3.event.preventDefault();
      if(this.state.selectedNode){
        let alreadyExists = false;
        for(let i=0;i<this.state.edges.length;i++){
          if(this.state.edges[i].source.id===this.state.selectedNode.id&&this.state.edges[i].target.id===d.id){
            alreadyExists = true;
          }
        }
        if(!alreadyExists){
          if(d.id!==this.state.selectedNode.id){
            const newEdge = {id:Date.now().toString(),source:this.state.selectedNode,target:d};
            this.props.onCreateEdge(newEdge.source,newEdge.target).then(()=>{
              this.setSvg();
            });
            const edges = this.state.edges;
            edges.push(newEdge);
            this.setState({edges});
        }
        }
      }
    }
    keyHandler = () => {
      d3.select("body").on("keydown",()=>{
        if(d3.event.keyCode===38){
          let translateY = this.state.translateY;
          translateY+=(10/this.state.zoom);
          this.setState({translateY});
          this.setSvg();
        }
        if(d3.event.keyCode===40){
          let translateY = this.state.translateY;
          translateY-=(10/this.state.zoom);
          this.setState({translateY});
          this.setSvg();
        }
        if(d3.event.keyCode===37){
          let translateX = this.state.translateX;
          translateX+=(10/this.state.zoom);
          this.setState({translateX});
          this.setSvg();
        }
        if(d3.event.keyCode===39){
          let translateX = this.state.translateX;
          translateX-=(10/this.state.zoom);
          this.setState({translateX});
          this.setSvg();
        }
        if(d3.event.keyCode===46){
          if(this.state.selectedNode){
            const newNodes = this.state.nodes.filter(node=>{
              if(this.state.selectedNode){
                if(node.id===this.state.selectedNode.id){
                    this.deleteConnectedEdges(node).then(()=>{
                                        this.props.onDeleteNode(node).then(()=>{
                                            this.setSvg();
                                        });
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
                  this.props.onDeleteEdge(edge).then(()=>{
                        this.setSvg();
                  });
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
  getMousePosition = (svg:any,eventX:number,eventY:number):any => {
    const rect = svg.getBoundingClientRect();
    const x = eventX -rect.left-svg.clientLeft-window.pageXOffset-this.state.translateX;
    const y = eventY -rect.top-svg.clientTop-window.pageYOffset-this.state.translateY;
    const distanceFromCenterX = x-(this.props.width/2)+this.state.translateX;
    const distanceFromCenterY = y-(this.props.height/2)+this.state.translateY;
    return {x:x+(distanceFromCenterX/this.state.zoom-distanceFromCenterX),y:y+(distanceFromCenterY/this.state.zoom-distanceFromCenterY)};
  }
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
  zoomHandler = () => {
    const deltaY = d3.event.deltaY;
    let {zoom}= this.state;
    if(deltaY>0){
      zoom/=1.5;
      this.setState({zoom});
    }
    if(deltaY<0){
      zoom*=1.5;
      this.setState({zoom});
    }
    this.setSvg();
  }

  svgMouseUpHandler = (svg:any) => {
    if(this.state.beingDragged){
      let {x,y} = this.getMousePosition(svg.node(),d3.event.clientX,d3.event.clientY);
      if(Math.abs(this.state.beingDragged.x-x)<30&&Math.abs(this.state.beingDragged.y-y)<30){
        x=this.state.beingDragged.x;
        y=this.state.beingDragged.y;
          this.setState({beingDragged:undefined});
      }else{
        this.setState({dragged:true});
        x -= (this.props.width/2);
        y -= (this.props.height/2);

        const nodes = this.state.nodes.map(node=>{
          if(this.state.beingDragged){
            if(node.id===this.state.beingDragged.id){
              return {...this.state.beingDragged,x,y};
            }
          }
          return node;
        });

        const sendNode =this.state.beingDragged;
        this.props.onNodeDragEnd({...sendNode,x,y});
        this.setState({beingDragged:undefined,nodes});
        this.setSvg();
      }
    }
  }
  svgClickHandler = (svg:any) => {
    if(d3.event.shiftKey){
      const {x,y} = this.getMousePosition(svg.node(),d3.event.clientX,d3.event.clientY);
      const newNode = {id:Date.now().toString(),title:"New Knot",x,y};
      this.props.onCreateNode({...newNode,x:x-(this.props.width/2),y:y-(this.props.height/2)});
      const nodes = this.state.nodes;
      nodes.push(newNode);
      this.setState({nodes});
      this.setSvg();
    }
  }
}
export default GraphView;
