import * as React from "react";

import CustomLabelModel from "./custom-label-model";
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
 * Component for custom label widget
 */
export const CustomLabelWidget: React.FC<Props> = () => {
  /**
   * Component render
   */
  return (
    <CustomLabel.Label>
      <input/>
    </CustomLabel.Label>
  );
};