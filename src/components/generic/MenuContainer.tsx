import * as React from "react";
import { Link } from "react-router-dom";
import strings from "../../localization/strings";
import { KeycloakInstance } from "keycloak-js";
import {
  Container,
  Image,
  Menu,
  Dropdown,
  Button
} from "semantic-ui-react"
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions/";

export interface Props {
  siteName: string,
  siteLogo?: string,
  authenticated: boolean,
  autolayout: boolean,
  keycloak?: KeycloakInstance,
  onLogout?: () => void
  onAutoLayoutToggle?: (a: boolean) => void
}

class MenuContainer extends React.Component<Props, object> {

  onAccountItemClick = () =>  {
    if (this.props.keycloak) {
      window.location.href = this.props.keycloak.createAccountUrl();
    }
  }

  onLogoutItemClick = () => {
    if (this.props.keycloak) {
      window.location.href = this.props.keycloak.createLogoutUrl();
    }
  }

  render() {
    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="div" header>
            <Link to="/">
              <Image inline size="mini" src={this.props.siteLogo} style={{ marginRight: "1.5em" }} />
              <span>{this.props.siteName}</span>
            </Link>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Button toggle active={this.props.autolayout} onClick={() => this.props.onAutoLayoutToggle && this.props.onAutoLayoutToggle(!this.props.autolayout)}>
                {strings.layoutAutomatically}
              </Button>
            </Menu.Item>
            { this.props.authenticated &&
            <Dropdown item simple text={strings.menuBarUserItemText}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={this.onAccountItemClick}>{strings.menuBarManageAccountText}</Dropdown.Item>
                <Dropdown.Item onClick={this.onLogoutItemClick}>{strings.menuBarLogoutText}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            }
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    authenticated: state.authenticated,
    keycloak: state.keycloak,
    autolayout: state.autolayout
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onLogout: () => dispatch(actions.userLogout()),
    onAutoLayoutToggle: (a: boolean) => dispatch(actions.autoLayoutToggle(a))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);