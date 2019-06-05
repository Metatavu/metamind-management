import * as Keycloak from "keycloak-js";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";
import {
  Grid,
  Header,
} from "semantic-ui-react";
import { IStoreState } from "src/types";
import * as actions from "../../actions";
import strings from "../../localization/strings";
import BasicLayout from "../generic/BasicLayout";

export interface IProps {
  authenticated: boolean;
  keycloak?: Keycloak.KeycloakInstance;
  onLogin?: (keycloak: Keycloak.KeycloakInstance, authenticated: boolean) => void;
}

interface IState {
  loadingRealms: boolean;
}

class Login extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      loadingRealms: false,
    };
  }

  public componentDidMount() {
    if (!this.props.authenticated) {
      this.doLogin();
    }
  }

  public render() {
    return (
      <BasicLayout>
        { this.props.authenticated ? (
          <div>
            <Redirect to="/" />
          </div>
        ) : (
          <Grid centered>
            <Grid.Row>
              <Header textAlign="center" >{strings.redirectingTokeycloak}</Header>
            </Grid.Row>
          </Grid>
        )}
      </BasicLayout>
    );
  }
  private doLogin() {
    const kcConf = {
      clientId: process.env.REACT_APP_AUTH_RESOURCE,
      realm: process.env.REACT_APP_REALM,
      url: process.env.REACT_APP_AUTH_SERVER_URL,

    };
    const keycloak = Keycloak(kcConf);
    keycloak.init({onLoad: "login-required"}).success((authenticated) => {
      if ( this.props.onLogin ) {
        this.props.onLogin(keycloak, authenticated);
      }

    });
  }
}

export function mapStateToProps(state: IStoreState) {
  return {
    authenticated: state.authenticated,
    keycloak: state.keycloak,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onLogin: (keycloak: KeycloakInstance, authenticated: boolean) => dispatch(actions.userLogin(keycloak, authenticated)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
