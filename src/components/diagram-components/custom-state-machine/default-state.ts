import {
	SelectingState,
	State,
	Action,
	InputType,
	ActionEvent,
	DragCanvasState
} from '@projectstorm/react-canvas-core';
import { DiagramEngine, DragDiagramItemsState } from '@projectstorm/react-diagrams-core';
import { CustomPortModel } from '../custom-port/custom-port-model';
import { CreateLinkState } from './create-link-state';

/**
 * Class for default state
 */
export class DefaultState extends State<DiagramEngine> {
	dragCanvas: DragCanvasState;
	createLink: CreateLinkState;
	dragItems: DragDiagramItemsState;

	constructor() {
		super({ name: 'starting-state' });
		this.childStates = [new SelectingState()];
		this.dragCanvas = new DragCanvasState();
		this.createLink = new CreateLinkState();
		this.dragItems = new DragDiagramItemsState();

		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<any>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);

					if (!element) {
						this.transitionWithEvent(this.dragCanvas, event);
					}
          
					else if (element instanceof CustomPortModel) {
						return;
					}
          
					else {
						this.transitionWithEvent(this.dragItems, event);
					}
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (event: ActionEvent<any>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);

					if (element instanceof CustomPortModel) this.transitionWithEvent(this.createLink, event);
				}
			})
		);
	}
}