import { LinkWidget } from "@projectstorm/react-diagrams";
import { DefaultLinkWidget } from "@projectstorm/react-diagrams-defaults";
import React from "react";

/**
 * Class component for custom link widget
 */
export default class CustomLinkWidget extends DefaultLinkWidget {

  /**
   * Component render
   */
  public render = () => {
    return (
      <g data-default-link-test={ this.props.link.getOptions().testName }>
        { this.renderPaths() }
      </g>
    );
  };

  /**
   * Renders paths
   */
  private renderPaths = () => {
    const { link } = this.props;

    const points = link.getPoints();
    const paths = [];
    this.refPaths = [];

    for (let j = 0; j < points.length - 1; j++) {
      paths.push(
        this.generateLink(
          LinkWidget.generateLinePath(points[j], points[j + 1]),
          {
            "data-linkid": link.getID(),
            "data-point": j
          },
          j
        )
      );
    }

    for (let i = 1; i < points.length - 1; i++) {
      paths.push(this.generatePoint(points[i]));
    }

    paths.push(this.generatePoint(points[points.length - 1]));

    return paths;
  };

}