import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import { AccessToken } from "../../types";
import { KeycloakInstance } from "keycloak-js";

/**
 * Component props
 */
interface Props {
  keycloak: KeycloakInstance;
  accessToken: AccessToken;
  children?: React.ReactNode;
}

/**
 * Component state
 */
interface State {
  error?: Error;
}

/**
 * Component for fetching initial data
 */
class StoreInitializer extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = { };
  }

  /**
   * Component did mount life cycle method
   */
  public componentDidMount = async () => {
    await this.fetchData();
  }

  /**
   * Component did update life cycle method
   *
   * @param prevProps previous component props
   */
  public componentDidUpdate = (prevProps: Props) => {
    if (!prevProps.accessToken && this.props.accessToken) {
      this.fetchData();
    }
  }

  /**
   * Component render method
   */
  public render = () => {
    const { children } = this.props;

    return (
        children
    );
  }

  /**
   * Fetch app data
   */
  private fetchData = async () => {
    try {
      const { accessToken } = this.props;
      if (!accessToken) {
        return;
      }

    } catch (error) {
      this.setState({ error });
    }
  }

}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 * @returns state from props
 */
const mapStateToProps = (state: ReduxState) => ({
  accessToken: state.auth.accessToken as AccessToken,
  keycloak: state.auth.keycloak as KeycloakInstance,
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(StoreInitializer);
