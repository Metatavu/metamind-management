import CustomLinkModel from "./custom-link-model";
import CustomLinkWidget from "./custom-link-widget";
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import CustomLinkSegment from "./custom-link-segment";
import React from "react";

/**
 * Class component for custom link factory
 */
export default class CustomLinkFactory extends DefaultLinkFactory {

  /**
   * Constructor
   */
  constructor() {
    super("custom-link");
  }

  /**
   * Generates custom link model
   */
  public generateModel = (): CustomLinkModel => {
    return new CustomLinkModel();
  };

  /**
   * Generates custom react widget
   *
   * @param event widget event 
   */
  public generateReactWidget = (event: any): JSX.Element => {
    return <CustomLinkWidget link={ event.model } diagramEngine={ this.engine }/>;
  };

  /**
   * Generates link segment
   *
   * @param model custom link model
   * @param selected is link selected
   * @param path path
   */
  public generateLinkSegment = (model: CustomLinkModel, selected: boolean, path: string) => {
    return (
      <g>
        <CustomLinkSegment model={ model } selected={ selected } path={ path }/>
      </g>
    );
  };

}