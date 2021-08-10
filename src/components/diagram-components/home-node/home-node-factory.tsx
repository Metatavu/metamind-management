import HomeNodeWidget from "./home-node-widget";
import HomeNodeModel from "./home-node-model";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import React from "react";

/**
 * Class for custom node factory
 */
export default class HomeNodeFactory extends AbstractReactFactory<HomeNodeModel, DiagramEngine> {

  /**
   * Constructor
   */
  constructor() {
    super("home-node");
  }

  /**
	 * Generates react widget
	 *
	 * @param event event
	 */
  public generateReactWidget = (event: any) => {
    return (
      <HomeNodeWidget
        node={ event.model }
        engine={ this.engine }
      />
    );
  };

  /**
	 * Generates custom node model
	 */
  public generateModel = () => {
    return new HomeNodeModel();
  };

}