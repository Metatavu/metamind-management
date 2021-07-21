import * as React from "react";
import { AppBar, Toolbar, withStyles, WithStyles, Box, Button, IconButton, Typography } from "@material-ui/core";
import { styles } from "./app-layout.styles";
import Logo from "../../../resources/svg/logo";
import strings from "../../../localization/strings";
import { Link, NavLink } from "react-router-dom";
import EditorIcon from "@material-ui/icons/Edit";
import PreviewIcon from "@material-ui/icons/PlayArrow";
import SaveIcon from "@material-ui/icons/Save";
import SettingsIcon from "@material-ui/icons/Settings";
import { KeycloakInstance } from "keycloak-js";
import { ReduxState } from "../../../store";
import { connect } from "react-redux";
import { StoryData } from "../../../types";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  children: React.ReactNode;
  onSaveClick?: () => void;
  dataChanged?: boolean;
  pageTitle: string;
  storyData?: StoryData;
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
      storyData,
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
              { storyData &&
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
              <Box ml={ 2 } display="flex" alignItems="center">
                <Typography color="textSecondary">
                  { firstName } { lastName }
                </Typography>
                <Box ml={ 1 }>
                  <Typography color="textSecondary">{ "//" }</Typography>
                </Box>
                <Button
                  variant="text"
                  onClick={ () => this.onLogOutClick() }
                >
                  { strings.header.signOut }
                </Button>
                <Box ml={ 2 }>
                  <IconButton
                    title={ strings.header.settings }
                    color="secondary"
                  >
                    <SettingsIcon/>
                  </IconButton>
                </Box>
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
    const { storyData } = this.props;

    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Link to="/">
          <Logo />
        </Link>
        { storyData &&
          <Box ml={ 2 }>
            <NavLink exact to={ `/editor/${storyData.story?.id}` } style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                startIcon={ <EditorIcon/> }
                color="secondary"
              >
                { strings.header.editor }
              </Button>
            </NavLink>
            <NavLink exact to={ `/preview/${storyData.story?.id}` } style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                startIcon={ <PreviewIcon/> }
                color="secondary"
              > 
                { strings.header.preview }
              </Button>
            </NavLink>
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

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 * @returns state from props
 */
const mapStateToProps = (state: ReduxState) => ({
  storyData: state.story.storyData,
});

export default connect(mapStateToProps)(withStyles(styles)(AppLayout));
