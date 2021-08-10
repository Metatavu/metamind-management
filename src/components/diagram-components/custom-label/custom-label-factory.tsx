import * as React from "react";

import { AbstractReactFactory, GenerateWidgetEvent } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import CustomLabelModel from "./custom-label-model";
import { CustomLabelWidget } from "./custom-label-widget";

/**
 * Custom label factory
 */
export default class CustomLabelFactory extends AbstractReactFactory<CustomLabelModel, DiagramEngine> {

  /**
   * Constructor
   */
  constructor() {
    super("custom-label");
  }

  /**
   * Generate custom label model
   *
   * @returns generated label model
   */
  public generateModel = (): CustomLabelModel => {
    return new CustomLabelModel();
  };

  /**
   * Generate react widget
   *
   * @param event event widget event 
   * @returns generated label widget
   */
  public generateReactWidget = (event: GenerateWidgetEvent<CustomLabelModel>): JSX.Element => {
    return <CustomLabelWidget model={ event.model }/>;
  };

}