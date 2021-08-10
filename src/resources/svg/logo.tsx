import { SvgIcon, SvgIconProps } from "@material-ui/core";
import * as React from "react";

/**
 * Interface representing component properties
 */
interface Props extends SvgIconProps {}

/**
 * Render custom Menu icon
 */
const Logo = (props: Props) => {
  return (
    <SvgIcon {...props}>
      <path fill="#fff" d="M5.76,2.62,0,21.38H4.1L7,10.55l3,10,1.23-9L8.72,2.62Z"/>
      <path fill="#fff" d="M15.28,2.62l-5,18.4h3.32L17,10.55l3,10.83h4L18.17,2.62Z"/>
    </SvgIcon>
  );
};

export default Logo;