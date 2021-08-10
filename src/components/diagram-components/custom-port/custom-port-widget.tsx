import * as React from "react";

import * as _ from "lodash";
import { ListenerHandle, Toolkit } from "@projectstorm/react-canvas-core";
import { DiagramEngine, PortModel, PortProps } from "@projectstorm/react-diagrams";

/**
 * Interface describing component properties
 */
export interface Props extends PortProps {
  port: PortModel;
  engine: DiagramEngine;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Class for custom port widget
 */
export class CustomPortWidget extends React.Component<PortProps> {

  ref: React.RefObject<HTMLDivElement>;
  engineListenerHandle?: ListenerHandle;

  /**
   * Constructor
   */
  constructor(props: PortProps) {
    super(props);
    this.ref = React.createRef();
  }

  /**
	 * Reports updated coordinates
	 */
  private report = () => {
    const { port, engine } = this.props;

    port.updateCoords(engine.getPortCoords(port, this.ref.current || undefined));
  };

  /**
	 * Component will unmount life cycle handler
	 */
  public componentWillUnmount = () => {
    this.engineListenerHandle && this.engineListenerHandle.deregister();
  };

  /**
	 * Component did update life cycle handler
	 */
  public componentDidUpdate = () => {
    const { port } = this.props;

    if (port.reportedPosition) {
      this.report();
    }
  };

  /**
	 * Component did mount life cycle handler
	 */
  public componentDidMount = () => {
    const { engine } = this.props;

    this.engineListenerHandle = engine.registerListener({
      canvasReady: () => {
        this.report();
      }
    });
    if (engine.getCanvas()) {
      this.report();
    }
  };

  /**
	 * Gets extra properties
	 */
  private getExtraProps = () => {
    const { port } = this.props;

    if (Toolkit.TESTING) {
      const links = _.keys(port.getNode().getPort(port.getName())?.links).join(",");
      return {
        "data-links": links
      };
    }
    return {};
  };

  /**
	 * Component render
	 */
  public render = () => {
    const { style, className, port, children } = this.props;

    return (
      <div
        style={ style}
        ref={ this.ref }
        className={ `port ${className || ""}` }
        data-name={ port.getName() }
        data-nodeid={ port.getNode().getID() }
        { ...this.getExtraProps() }
      >
        { children }
      </div>
    );
  };

}