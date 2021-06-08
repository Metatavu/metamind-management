
import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';

/**
 * Class for custom port factory
 */
export class CustomPortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
	cb: (initialConfig?: any) => PortModel;

	constructor(type: string, cb: (initialConfig?: any) => PortModel) {
		super(type);
		this.cb = cb;
	}

	/**
	 * Generates model
	 *
	 * @param event event
	 * @returns port model
	 */
	public generateModel = (event:any): PortModel => {
		return this.cb(event.initialConfig);
	}
}