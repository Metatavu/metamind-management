import * as React from "react";

import { CustomLabelModel } from "./custom-label-model";
import styled from "@emotion/styled";

/**
 * Interface describing component properties
 */
interface Props {
	model: CustomLabelModel;
}

/**
 * Namespace for custom label
 */
namespace CustomLabel {
	export const Label = styled.div`
		user-select: none;
		pointer-events: auto;
	`;
}

/**
 * Class for custom label widget
 */
export class CustomLabelWidget extends React.Component<Props>  {

  /**
   * Component render
   */
  public render = () => {

    return (
      <CustomLabel.Label>
        <input />
        <button>Click me!</button>
      </CustomLabel.Label>
    );
  }
};