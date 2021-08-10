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
    <SvgIcon {...props} viewBox="0 0 23 33">
      <g>
        <path
          fill={ htmlColor || "#000" }
          d="M9.84132 0C10.9574 0 12.0264 0 13.1259 0C13.1319 0.130103 13.1412 0.247528 13.1412 0.364954C13.1425 1.26566 13.1505 2.16704 13.1365 3.06708C13.1326 3.32128 13.2095 3.38867 13.4635 3.4327C17.5372 4.14393 20.723 6.09413 22.4008 10.0606C23.1581 11.8507 23.1289 13.7155 22.6939 15.5803C21.7588 19.5874 19.9716 23.1729 17.3217 26.3074C16.3289 27.4817 15.1983 28.5331 13.7645 29.1396C13.2227 29.3691 13.0974 29.65 13.1292 30.1885C13.1776 31.0084 13.1418 31.8337 13.1418 32.6564C13.1418 32.7645 13.1418 32.8732 13.1418 33C12.0311 33 10.9528 33 9.84132 33C9.84132 32.8626 9.84132 32.7431 9.84132 32.6237C9.84132 31.6449 9.84597 30.6662 9.83536 29.6881C9.83403 29.5793 9.77368 29.4045 9.69609 29.3738C7.97389 28.6979 6.64626 27.4957 5.48773 26.1066C3.13287 23.283 1.50815 20.0591 0.514085 16.519C0.187151 15.3548 -0.030363 14.1652 0.00345782 12.9395C0.0551837 11.0841 0.646053 9.41942 1.73694 7.93959C3.3736 5.71917 5.58256 4.3601 8.22854 3.69358C8.68545 3.57882 9.15231 3.49609 9.6185 3.4247C9.83933 3.39067 9.84331 3.26657 9.84265 3.09844C9.83933 2.19773 9.84132 1.29702 9.84132 0.395645C9.84132 0.276218 9.84132 0.154121 9.84132 0ZM3.86964 16.3816C3.90677 16.499 3.9333 16.5924 3.96513 16.6845C4.80999 19.1417 6.0461 21.3902 7.60451 23.4551C8.32602 24.4112 9.1344 25.2953 10.1643 25.9451C11.0251 26.4882 11.8885 26.5536 12.7406 25.9791C13.2333 25.6469 13.7234 25.2886 14.1379 24.8656C16.0391 22.9227 17.3727 20.6016 18.4623 18.1283C18.7097 17.5672 18.9093 16.984 19.1454 16.3736C14.0245 17.6032 8.96994 17.6025 3.86964 16.3816Z"
        />
      </g>
    </SvgIcon>
  );
};
export default GlobalKnot;