import HomeNodeWidget from "./home-node-widget";
import { HomeNodeModel } from "./home-node-model";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import React from "react";

/**
 * Class for custom node factory
 */
export class HomeNodeFactory extends AbstractReactFactory<HomeNodeModel, DiagramEngine> {

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
	}

	/**
	 * Generates custom node model
	 *
	 * @param event event
	 */
	public generateModel = (event: any) => {
		return new HomeNodeModel();
	}
}