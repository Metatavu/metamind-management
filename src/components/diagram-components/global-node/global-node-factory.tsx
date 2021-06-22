import GlobalNodeWidget from "./global-node-widget";
import { GlobalNodeModel } from "./global-node-model";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import React from "react";

/**
 * Class for custom node factory
 */
export class GlobalNodeFactory extends AbstractReactFactory<GlobalNodeModel, DiagramEngine> {

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
	}

	/**
	 * Generates custom node model
	 *
	 * @param event event
	 */
	public generateModel = (event: any) => {
		return new GlobalNodeModel();
	}
}