import { LabelModel } from "@projectstorm/react-diagrams";
import { BaseModelOptions } from "@projectstorm/react-canvas-core";

/**
 * Interface for custom label options
 */
interface CustomLabelOptions extends BaseModelOptions { }

/**
 * Class for custom label model
 */
export default class CustomLabelModel extends LabelModel {

  /**
   * Constructor
   */
  constructor(options: CustomLabelOptions = {}) {
    super({
      ...options,
      type: "custom-label"
    });
  }

}