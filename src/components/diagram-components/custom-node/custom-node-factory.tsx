import CustomNodeWidget from "./custom-node-widget";
import { CustomNodeModel } from "./custom-node-model";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import React from "react";

/**
 * Class for custom node factory
 */
export class CustomNodeFactory extends AbstractReactFactory<CustomNodeModel, DiagramEngine> {

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
	}

	/**
	 * Generates custom node model
	 *
	 * @param event event
	 */
	public generateModel = (event: any) => {
		return new CustomNodeModel();
	}
}