import { DefaultLinkModel, DefaultLinkModelOptions } from "@projectstorm/react-diagrams";

/**
 * Class component for custom link model
 */
export default class CustomLinkModel extends DefaultLinkModel {
	constructor(options?: DefaultLinkModelOptions) {
		super({
			id: options?.id,
			type: "custom-link",
			width: options?.width || 4,
      color: options?.color || "#ffffff",
      selectedColor: options?.selectedColor || "#36b0f4"
		});
	}
}