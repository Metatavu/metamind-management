import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxState } from "../../store";
import { login } from "../../actions/auth";

import Keycloak, { KeycloakInstance } from "keycloak-js";
import { AccessToken } from "../../types";

/**
 * Component props
 */
interface Props {
  accessToken?: AccessToken;
  onLogin: typeof login;
  children?: React.ReactNode;
}

/**
 * Component state
 */
interface State {}

/**
 * Component for keeping authentication token fresh
 */
class AccessTokenRefresh extends React.Component<Props, State> {

  private keycloak: KeycloakInstance;
  private timer?: NodeJS.Timer;

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.keycloak = Keycloak({
      url: process.env.REACT_APP_KEYCLOAK_URL,
      realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
    });

    this.state = {};
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { onLogin } = this.props;

    const auth = await this.keycloakInit();

    if (!auth) {
      window.location.reload();
    } else {
      const { token, tokenParsed } = this.keycloak;

      if (this.keycloak && tokenParsed && tokenParsed.sub && token) {
        this.keycloak.loadUserProfile();
        onLogin(this.keycloak);
      }

      this.refreshAccessToken();

      this.timer = setInterval(() => {
        this.refreshAccessToken();
      }, 1000 * 60);
    }
  };

  /**
   * Component will unmount life cycle event
   */
  public componentWillUnmount = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  /**
   * Component render method
   */
  public render = () => {
    const { accessToken, children } = this.props;

    return accessToken ? children : null;
  };

  /**
   * Refreshes access token
   */
  private refreshAccessToken = async () => {
    const { onLogin } = this.props;

    try {
      const refreshed = await this.keycloak.updateToken(70);
      if (refreshed) {
        const { token, tokenParsed } = this.keycloak;

        if (tokenParsed && tokenParsed.sub && token) {
          onLogin(this.keycloak);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Initializes Keycloak client
   */
  private keycloakInit = () => {
    return new Promise((resolve, reject) => {
      this.keycloak.init({
        onLoad: "login-required", checkLoginIframe: false
      })
        .then(resolve)
        .catch(reject);
    });
  };

}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 */
const mapStateToProps = (state: ReduxState) => ({
  accessToken: state.auth.accessToken
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLogin: (keycloak: KeycloakInstance) => dispatch(login(keycloak))
});

export default connect(mapStateToProps, mapDispatchToProps)(AccessTokenRefresh);