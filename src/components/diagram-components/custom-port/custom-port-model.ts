import CustomLinkModel from "../custom-link/custom-link-model";
import { DefaultPortModel, DefaultPortModelOptions } from "@projectstorm/react-diagrams";

/**
 * Interface describing custom port model options
 */
interface CustomPortModelOptions extends DefaultPortModelOptions { }

/**
 * Class for custom port model
 */
export default class CustomPortModel extends DefaultPortModel {

  /**
   * Constructor
   */
  constructor(options: CustomPortModelOptions) {
    super({
      type: "custom-port",
      name: options.name,
      maximumLinks: 1,
      in: !!options.in
    });
  }

  /**
	 * Creates custom link model
	 *
	 * @returns custom link model
	 */
  public createLinkModel = (): CustomLinkModel => {
    return new CustomLinkModel();
  };

}