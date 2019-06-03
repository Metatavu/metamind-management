import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import {
  Button,
  Container,
  Dropdown,
  Image,
  Input,
  InputOnChangeData,
  Menu,
} from "semantic-ui-react";
import { IStoreState } from "src/types";
import * as actions from "../../actions/";
import strings from "../../localization/strings";

export interface IProps {
  siteName: string;
  siteLogo?: string;
  authenticated: boolean;
  autolayout: boolean;
  keycloak?: KeycloakInstance;
  onLogout?: () => void;
  onAutoLayoutToggle?: (a: boolean) => void;
  onSearch: (searchText: string) => void;
}

class MenuContainer extends React.Component<IProps, object> {

  public onAccountItemClick = () =>  {
    if (this.props.keycloak) {
      window.location.href = this.props.keycloak.createAccountUrl();
    }
  }

  public onLogoutItemClick = () => {
    if (this.props.keycloak) {
      window.location.href = this.props.keycloak.createLogoutUrl();
    }
  }

  public render() {
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
              <Button toggle
              active={this.props.autolayout}
              onClick={() => this.props.onAutoLayoutToggle && this.props.onAutoLayoutToggle(!this.props.autolayout)}>
                {strings.layoutAutomatically}
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Input
              placeholder={ strings.search }
              onChange={ (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => { this.props.onSearch(data.value); }  }/>
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

export function mapStateToProps(state: IStoreState) {
  return {
    authenticated: state.authenticated,
    autolayout: state.autolayout,
    keycloak: state.keycloak,

  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onAutoLayoutToggle: (a: boolean) => dispatch(actions.autoLayoutToggle(a)),
    onLogout: () => dispatch(actions.userLogout()),
    onSearch: (searchText: string) => dispatch(actions.search(searchText)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
