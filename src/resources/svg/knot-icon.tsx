import { SvgIcon, SvgIconProps } from "@material-ui/core";
import * as React from "react";

/**
 * Interface representing component properties
 */
interface Props extends SvgIconProps {}

/**
 * Render knot icon
 */
const KnotIcon = (props: Props) => {
  const { htmlColor } = props;

  return (
    <SvgIcon {...props}>
      <g>
        <path
          fill={ htmlColor || "#fff" }
          d="M20.5,12h-7c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5H17l-3,3h2l3-3h1.5c0.8,0,1.5-0.7,1.5-1.5S21.3,12,20.5,12
          z"
        />
        <path fill={ htmlColor || "#fff" } d="M14.5,19H11l-4-6H5l4,6H7.5C6.7,19,6,19.7,6,20.5S6.7,22,7.5,22h7c0.8,0,1.5-0.7,1.5-1.5S15.3,19,14.5,19z"/>
        <path
          fill={ htmlColor || "#fff" }
          d="M12,10.5C12,9.7,11.3,9,10.5,9H7l3-3H8L5,9H3.5C2.7,9,2,9.7,2,10.5S2.7,12,3.5,12h7C11.3,12,12,11.3,12,10.5z"
        />
        <path fill={ htmlColor || "#fff" } d="M9.5,5H13l4,6h2l-4-6h1.5C17.3,5,18,4.3,18,3.5S17.3,2,16.5,2h-7C8.7,2,8,2.7,8,3.5S8.7,5,9.5,5z"/>
      </g>
    </SvgIcon>
  );
};
export default KnotIcon;