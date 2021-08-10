import CustomLinkModel from "../custom-link/custom-link-model";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import CustomPortModel from "../custom-port/custom-port-model";
import { Action, ActionEvent, InputType, State } from "@projectstorm/react-canvas-core";

/**
 * Interface for link state options
 */
interface CreateLinkStateOptions {
  allowLooseLinks?: boolean;
  allowLinksFromLockedPorts?: boolean;
}

/**
 * This state is controlling the creation of a link.
 */
export default class CreateLinkState extends State<DiagramEngine> {

  port?: CustomPortModel;
  link?: CustomLinkModel;
  initialX?: number;
  initialY?: number;
  initialXRelative?: number;
  initialYRelative?: number;
  config?: CreateLinkStateOptions;

  /**
   * Constructor
   */
  constructor(options: CreateLinkStateOptions = {}) {
    super({ name: "create-new-link" });

    this.config = {
      allowLooseLinks: false,
      allowLinksFromLockedPorts: false,
      ...options
    };

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (actionEvent: ActionEvent<any>) => {
          const model = this.engine.getActionEventBus().getModelForEvent(actionEvent);

          if (model instanceof CustomPortModel && !this.port) {
            this.port = this.engine.getMouseElement(actionEvent.event) as CustomPortModel;
            const rel = this.engine.getRelativePoint(actionEvent.event.clientX, actionEvent.event.clientY);
            this.initialXRelative = rel.x;
            this.initialYRelative = rel.y;
            this.initialX = actionEvent.event.clientX;
            this.initialY = actionEvent.event.clientY;

            if (!this.config?.allowLinksFromLockedPorts && this.port.isLocked()) {
              this.eject();
              return;
            }

            this.link = this.port.createLinkModel();

            if (!this.link) {
              this.eject();
              return;
            }

            this.link.setSelected(true);
            this.link.setSourcePort(this.port);
            this.engine.getModel().addLink(this.link);
            this.port.reportPosition();
          } else if (model instanceof CustomPortModel && this.port !== model && (this.port && !this.hasLinkAlready(this.port, model))) {
            if (this.port?.canLinkToPort(model)) {
              this.link?.setTargetPort(model);
              model.reportPosition();
              this.clearState();
              this.eject();
              this.engine.repaintCanvas();
            }
          } else {
            this.link?.remove();
            this.clearState();
            this.eject();
            this.engine.repaintCanvas();
          }
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_MOVE,
        fire: (actionEvent: ActionEvent<any>) => {
          requestAnimationFrame(() => {
            if (!this.port || !this.initialXRelative || !this.initialYRelative || !this.initialX || !this.initialY) {
              return;
            }
            
            const portPos = this.port.getPosition();
            const zoomLevelPercentage = this.engine.getModel().getZoomLevel() / 100;
            const engineOffsetX = this.engine.getModel().getOffsetX() / zoomLevelPercentage;
            const engineOffsetY = this.engine.getModel().getOffsetY() / zoomLevelPercentage;
            const initialXRelative = this.initialXRelative / zoomLevelPercentage;
            const initialYRelative = this.initialYRelative / zoomLevelPercentage;
            const virtualDisplacementX = (actionEvent.event.clientX - this.initialX) / (this.engine.getModel().getZoomLevel() / 100.0);
            const virtualDisplacementY = (actionEvent.event.clientY - this.initialY) / (this.engine.getModel().getZoomLevel() / 100.0);
            const linkNextX = portPos.x - engineOffsetX + (initialXRelative - portPos.x) + virtualDisplacementX;
            const linkNextY = portPos.y - engineOffsetY + (initialYRelative - portPos.y) + virtualDisplacementY;

            this.link?.getLastPoint().setPosition(linkNextX, linkNextY);
            this.engine.repaintCanvas();
          });
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.KEY_UP,
        fire: (actionEvent: ActionEvent<any>) => {
          if (actionEvent.event.keyCode === 27 && this.link) {
            this.link.remove();
            this.clearState();
            this.eject();
            this.engine.repaintCanvas();
          }
        }
      })
    );
  }

  private hasLinkAlready = (port1: CustomPortModel, port2: CustomPortModel) => {
    const { links } = port1;
    const keys = Object.keys(links);
    return keys.some(key => {
      const link = links[key as keyof object];
      const sourcePortId = link.getSourcePort()?.getID();
      const targetPortId = link.getTargetPort()?.getID();
      return sourcePortId === port1.getID() && targetPortId === port2.getID();
    });
  };

  private clearState = () => {
    this.link = undefined;
    this.port = undefined;
  };

}