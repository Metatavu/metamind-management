import { SvgIcon, SvgIconProps } from "@material-ui/core";
import * as React from "react";

/**
 * Interface representing component properties
 */
interface Props extends SvgIconProps {}

/**
 * Render global knot icon
 */
const GlobalKnot = (props: Props) => {
  const { htmlColor } = props;

  return (
    <SvgIcon {...props}>
      <g>
        <polygon fill={ htmlColor ? htmlColor : "#fff" } points="8,8 8,6 5,3 4.5,4.5 3,5 6,8 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" } points="21,5 19.5,4.5 19,3 16,6 16,8 18,8 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" }  points="16,16 16,18 19,21 19.5,19.5 21,19 18,16 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" }  points="3,19 4.5,19.5 5,21 8,18 8,16 6,16 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" }  points="18,14 16,12 18,10 18,9 15,9 15,6 14,6 12,8 10,6 9,6 9,9 6,9 6,10 8,12 6,14 6,15 9,15 9,18 10,18 
          12,16 14,18 15,18 15,15 18,15 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" }  points="13.4,5.1 13.4,1 12,1.7 10.6,1 10.6,5.1 12,6.5 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" }  points="10.6,18.9 10.6,23 12,22.3 13.4,23 13.4,18.9 12,17.5 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" }  points="23,10.6 18.9,10.6 17.5,12 18.9,13.4 23,13.4 22.3,12 	"/>
        <polygon fill={ htmlColor ? htmlColor : "#fff" }  points="5.1,13.4 6.5,12 5.1,10.6 1,10.6 1.7,12 1,13.4 	"/>
      </g>
    </SvgIcon>
  );
}
export default GlobalKnot;