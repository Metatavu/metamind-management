import CustomPortModel from "../custom-port/custom-port-model";
import { DefaultNodeModel, DefaultNodeModelOptions } from "@projectstorm/react-diagrams";

/**
 * Class for custom node model
 */
export default class GlobalNodeModel extends DefaultNodeModel {

  /**
   * Constructor
   */
  constructor(options?: DefaultNodeModelOptions) {
    super({
      id: options?.id,
      type: "global-node",
      name: options?.name
    });
    this.addPort(new CustomPortModel({ name: "out" }));
    this.addPort(new CustomPortModel({ name: "in", in: true }));
  }

}