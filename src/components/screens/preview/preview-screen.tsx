import { Box, Drawer, WithStyles, withStyles } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./preview-screen.styles";
import { History } from "history";
import { KeycloakInstance } from 'keycloak-js';
import strings from "../../../localization/strings";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  accessToken: AccessToken;
  storyId: string;
}

/**
 * Interface describing component state
 */
interface State {
  locale?: string;
}

/**
 * Preview screen component
 */
class PreviewScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      locale: strings.getLanguage()
    };
  }

  /**
   * Component render
   */
  public render = () => {
    const { keycloak } = this.props;

    return (
      <AppLayout
        keycloak={ keycloak }
        pageTitle="Story name"
        dataChanged={ true }
        storySelected={ true }
        locale={ this.state.locale }
        setLocale={ this.setLocale }
      >
        { this.renderLeftToolbar() }
        <Box marginLeft="320px">

        </Box>
      </AppLayout>
    );
  }

  /**
   * Renders left toolbar
   */
  private renderLeftToolbar = () => {
    return (
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar/>
      </Drawer>
    );
  }

  /**
   * Sets locale
   * 
   * @param locale locale
   */
  private setLocale = (locale: string) => {
    this.setState({ locale: locale });
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
  locale: state.locale.locale
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PreviewScreen));
