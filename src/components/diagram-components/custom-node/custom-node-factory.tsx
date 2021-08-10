import CustomNodeWidget from "./custom-node-widget";
import CustomNodeModel from "./custom-node-model";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import React from "react";

/**
 * Class for custom node factory
 */
export default class CustomNodeFactory extends AbstractReactFactory<CustomNodeModel, DiagramEngine> {

  /**
   * Constructor
   */
  constructor() {
    super("custom-node");
  }

  /**
   * Generates react widget
   *
   * @param event event
   */
  public generateReactWidget = (event: any) => {
    return (
      <CustomNodeWidget
        node={ event.model }
        engine={ this.engine }
      />
    );
  };

  /**
   * Generates custom node model
   */
  public generateModel = () => {
    return new CustomNodeModel();
  };

}