import React from "react";

import styles from "../styles/custom-link";
import CustomLinkModel from "./custom-link-model";
import { WithStyles, withStyles } from "@material-ui/core";
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

/**
 * Interface describing component properties
 */
interface Props extends WithStyles<typeof styles> {
  path: string;
  selected: boolean;
  model: CustomLinkModel;
}

/**
 * Custom namespace for link segment
 */
namespace S {
  export const Keyframes = keyframes`
    from {
      stroke-dashoffset: 24;
    }
    to {
      stroke-dashoffset: 0;
    }
  `;

  const selected = css`
    stroke-dasharray: 4;
    animation: ${Keyframes} 1s linear infinite;
  `;

  export const Path = styled.path<{ selected: boolean }>`
    ${p => p.selected && selected};
    fill: none;
    pointer-events: all;
  `;
}

/**
 * Class component for custom link segment
 */
class CustomLinkSegment extends React.Component<Props> {

  private path = React.createRef<SVGPathElement>();

  public render = () => {
    const { model, classes, path, selected } = this.props;
    const options = model.getOptions();

    return (
      <>
        <S.Path
          d={ path }
          fill="none"
          ref={ this.path }
          strokeDasharray={ 4 }
          className={ classes.path }
          strokeWidth={ options.width }
          selected={ !!options.selected }
          stroke={ selected ? options.selectedColor : options.color }
        />
        { !!selected &&
          <S.Path
            d={ path }
            fill="none"
            ref={ this.path }
            strokeOpacity={ 0.1 }
            selected={ selected }
            strokeLinecap="round"
            className={ classes.path }
            stroke={ options.selectedColor }
          />
        }
      </>
    );
  };

}

export default withStyles(styles)(CustomLinkSegment);