import GlobalNodeWidget from "./global-node-widget";
import GlobalNodeModel from "./global-node-model";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import React from "react";

/**
 * Class for custom node factory
 */
export default class GlobalNodeFactory extends AbstractReactFactory<GlobalNodeModel, DiagramEngine> {

  /**
   * Constructor
   */
  constructor() {
    super("global-node");
  }

  /**
	 * Generates react widget
	 *
	 * @param event event
	 */
  public generateReactWidget = (event: any) => {
    return (
      <GlobalNodeWidget
        node={ event.model }
        engine={ this.engine }
      />
    );
  };

  /**
	 * Generates custom node model
	 */
  public generateModel = () => {
    return new GlobalNodeModel();
  };

}