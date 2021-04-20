import * as React from "react";
import { AppBar, Toolbar, withStyles, WithStyles, Box, Button, IconButton, Typography } from "@material-ui/core";
import { styles } from "./app-layout.styles";
import Logo from "../../../resources/svg/logo";
import strings from "../../../localization/strings";
import { Link } from "react-router-dom";
import EditorIcon from "@material-ui/icons/Edit";
import PreviewIcon from "@material-ui/icons/PlayArrow";
import SaveIcon from "@material-ui/icons/Save";
import SettingsIcon from "@material-ui/icons/Settings";
import { KeycloakInstance } from "keycloak-js";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  onSaveClick?: () => void;
  dataChanged?: boolean;
  storySelected?: boolean;
  pageTitle: string;
  storyId?: string;
  keycloak: KeycloakInstance;
}

/**
 * Interface describing component state
 */
interface State {
}

/**
 * App layout component. Provides the basic page layout with a header
 */
class AppLayout extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.state = {}
  }
  /**
   * Component render method
   */
  public render = () => {
    const {
      classes,
      children,
      onSaveClick,
      dataChanged,
      storySelected,
      keycloak
    } = this.props;
    const firstName = (keycloak.profile && keycloak.profile.firstName) ?? "";
    const lastName = (keycloak.profile && keycloak.profile.lastName) ?? "";

    return (
      <>
        <AppBar position="fixed">
          <Toolbar>
            { this.renderNavigation() }
            { this.renderPageTitle() }
            <Box display="flex" alignItems="center">
              { storySelected &&
                <Button
                  onClick={ onSaveClick }
                  disabled={ !dataChanged }
                  variant="text"
                  color="secondary"
                  startIcon={ <SaveIcon/> }
                >
                  { strings.generic.save }
                </Button>
              }
              <Box display="flex" alignItems="center">
                <Typography color="textSecondary">
                  { firstName } { lastName }
                </Typography>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={ () => this.onLogOutClick() }
                >
                  { strings.header.signOut }
                </Button>
                <IconButton color="secondary">
                  <SettingsIcon/>
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box className={ classes.root }>
          { children }
        </Box>
      </>
    );
  }

  /**
   * Renders navigation
   */
  private renderNavigation = () => {
    const { storySelected } = this.props;

    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Link to="/">
          <Logo />
        </Link>
        { storySelected &&
          <Box ml={ 2 }>
            <Button
              variant="text"
              startIcon={ <EditorIcon/> }
              color="secondary"
            >
              { strings.header.editor }
            </Button>
            <Button
              variant="text"
              startIcon={ <PreviewIcon/> }
              color="secondary"
            > 
              { strings.header.preview }
            </Button>
          </Box>
        }
      </Box>
    );
  }

  /**
   * Renders title
   */
  private renderPageTitle = () => {
    const { pageTitle } = this.props;

    return (
      <Box
        display="flex"
        position="absolute"
        left="0"
        right="0"
        justifyContent="center"
        zIndex="-1"
      >
        <Box display="flex" alignItems="center">
          <Typography color="textSecondary" >
            { strings.header.title }
          </Typography>
          <Box ml={ 2 } mr={ 2 }>
            <Typography color="textSecondary">
              { "//" }
            </Typography>
          </Box>
          <Typography color="textSecondary">
            { pageTitle }
          </Typography>
        </Box>
      </Box>
    );
  }

  /**
   * Event handler for logout click
   */
    private onLogOutClick = () => {
      const { keycloak } = this.props;

      if (keycloak) {
        keycloak.logout();
      }
    }
}

export default withStyles(styles)(AppLayout);
