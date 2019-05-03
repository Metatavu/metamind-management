import * as React from 'react';
import  { GraphUtils, INode } from "react-digraph"

/**
 * Component properties
 */
interface Props {
  data: INode,
  isSelected: boolean
}

/**
 * Component for rendering text on knot
 */
class KnotText extends React.Component<Props> {

  /**
   * Render
   */
  public render() {
    const { data } = this.props;
    const title = data.title;
    const className = GraphUtils.classNames('node-text', { selected: false });

    return (
      <text className={className} textAnchor="middle">
        {!!title && (
          <tspan style={{stroke:"white", fontWeight: "bold", fontSize: "1.5rem"}} opacity="0.5">{title}</tspan>
        )}
      </text>
    );
  }
}

export default KnotText;
