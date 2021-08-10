import CustomPortModel from "../custom-port/custom-port-model";
import { DefaultNodeModel, DefaultNodeModelOptions } from "@projectstorm/react-diagrams";

/**
 * Class for custom node model
 */
export default class HomeNodeModel extends DefaultNodeModel {

  /**
   * Constructor
   */
  constructor(options?: DefaultNodeModelOptions) {
    super({
      id: options?.id,
      type: "home-node",
      name: options?.name
    });
    this.addPort(new CustomPortModel({ name: "out" }));
    this.addPort(new CustomPortModel({ name: "in", in: true }));
  }

}