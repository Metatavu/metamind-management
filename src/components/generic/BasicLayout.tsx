import * as React from "react";

import "semantic-ui-css/semantic.min.css";

import { Container } from "semantic-ui-react";
import MenuContainer from "./MenuContainer";

class BasicLayout extends React.Component {
  public render() {
    return (
      <div>
        <MenuContainer siteName="Metamind Management"/>
        <Container fluid>
          {this.props.children}
        </Container>
      </div>
    );
  }
}

export default BasicLayout;
