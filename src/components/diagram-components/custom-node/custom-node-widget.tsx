import * as React from "react";

import styles from "../styles/custom-node";
import CustomNodeModel from "./custom-node-model";
import AttachmentIcon from "@material-ui/icons/Attachment";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { CustomPortWidget } from "../custom-port/custom-port-widget";
import SportsVolleyballIcon from "@material-ui/icons/SportsVolleyball";
import { Typography, withStyles, WithStyles } from "@material-ui/core";
import { DefaultNodeModelOptions, DefaultPortModel } from "@projectstorm/react-diagrams";

/**
 * Interface describing component properties
 */
interface Props extends WithStyles<typeof styles> {
  engine: DiagramEngine;
  node: CustomNodeModel;
}

/**
 * Interface describing component state
 */
interface State {
  showInPort: boolean;
}

/**
 * Class for custom node widget
 */
class CustomNodeWidget extends React.Component<Props, State> {

  private inPort: DefaultPortModel;
  private outPort: DefaultPortModel;

  /**
   * Constructor
   */
  constructor(props: Props) {
    super(props);

    const { node } = props;
    const [ inPort ] = node.getInPorts();
    const [ outPort ] = node.getOutPorts();
    this.inPort = inPort;
    this.outPort = outPort;

    this.state = {
      showInPort: false
    };
  }

  /**
   * Component did mount life cycle handler
   */
  public componentDidMount = () => {
    this.registerEventListeners();
  };

  /**
   * Component render
   */
  public render = () => {
    const { node, engine, classes } = this.props;
    const { showInPort } = this.state;
    const options = node.getOptions();

    return (
      <div
        className={ classes.node }
        style={ this.getDynamicStyles(options) }
      >
        <SportsVolleyballIcon className={ classes.icon }/>
        <Typography className={ classes.name }>
          { options.name }
        </Typography>
        <div
          className={ classes.contentTypes }
          style={{ display: showInPort ? "none" : "block" }}
        >
          <TextFieldsIcon/>
        </div>
        { this.outPort &&
          <CustomPortWidget
            engine={ engine }
            port={ this.outPort }
            className={ classes.port }
          >
            <div
              className={ classes.linkAction }
              style={{ display: showInPort ? "none" : "block" }}
            >
              <DoubleArrowIcon/>
            </div>
          </CustomPortWidget>
        }
        { this.inPort &&
          <CustomPortWidget
            engine={ engine }
            port={ this.inPort }
            className={ classes.port }
          >
            <div
              className={ classes.linkAction }
              style={{ display: showInPort ? "block" : "none" }}
            >
              <AttachmentIcon/>
            </div>
          </CustomPortWidget>
        }
      </div>
    );
  };

  /**
   * Register event listeners
   */
  private registerEventListeners = () => {
    const { engine } = this.props;
    const model = engine.getModel();

    model.registerListener({
      linksUpdated: this.onUpdateLinks
    });
  };

  /**
   * Event handler for update link
   *
   * @param event update event
   */
  private onUpdateLinks = (event: any) => {
    const link = event.link || event.entity;

    if (link.sourcePort !== this.outPort && !link.targetPort) {
      link.registerListener({
        targetPortChanged: this.onUpdateLinks,
        entityRemoved: this.cancelLink
      });

      this.setState({
        showInPort: true
      });
    } else if ((link.sourcePort && link.targetPort)) {
      this.setState({
        showInPort: false
      });
    }
  };

  /**
   * Event handler for cancel click
   */
  private cancelLink = () => {
    this.setState({
      showInPort: false
    });
  };

  /**
   * Gets dynamic styles for component
   *
   * @param options node model options
   * @returns React CSS properties object
   */
  private getDynamicStyles = (options: DefaultNodeModelOptions): React.CSSProperties => ({
    color: options.selected ? "#ffffff" : "#000000",
    backgroundColor: options.selected ? "#36b0f4" : "#ffffff"
  });

}

export default withStyles(styles)(CustomNodeWidget);