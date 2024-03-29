/* eslint-disable react/jsx-no-comment-textnodes */
import * as React from "react";
import { AppBar, Toolbar, withStyles, WithStyles, Box, Button, Typography, TextField, MenuItem } from "@material-ui/core";
import Logo from "../../../resources/svg/logo";
import strings from "../../../localization/strings";
import { Link, NavLink } from "react-router-dom";
import EditorIcon from "@material-ui/icons/Edit";
import PreviewIcon from "@material-ui/icons/PlayArrow";
import SaveIcon from "@material-ui/icons/Save";
import { KeycloakInstance } from "keycloak-js";
import { ReduxActions, ReduxState } from "../../../store";
import { connect } from "react-redux";
import { StoryData } from "../../../types";
import { setLocale } from "../../../actions/locale";
import { Dispatch } from "redux";
import appLayoutStyles from "./app-layout.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof appLayoutStyles> {
  onSaveClick?: () => void;
  dataChanged?: boolean;
  pageTitle: string;
  storyData?: StoryData;
  keycloak: KeycloakInstance;
  locale: string;
  storySelected: boolean;
  onSetLocale: typeof setLocale;
}

/**
 * App layout component. Provides the basic page layout with a header
 *
 * @param props component properties
 */
const AppLayout: React.FC<Props> = ({
  onSaveClick,
  dataChanged,
  storySelected,
  storyData,
  pageTitle,
  keycloak,
  locale,
  onSetLocale,
  classes,
  children
}) => {
  const firstName = keycloak.profile?.firstName ?? "";
  const lastName = keycloak.profile?.lastName ?? "";

  /**
   * Renders navigation
   */
  const renderNavigation = () => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Link to="/">
          <Logo/>
        </Link>
        { storyData &&
          <Box ml={ 2 }>
            <NavLink
              exact
              to={ `/editor/${storyData.story?.id}` }
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="text"
                startIcon={ <EditorIcon/> }
                color="secondary"
              >
                { strings.header.editor }
              </Button>
            </NavLink>
            <NavLink
              exact
              to={ `/preview/${storyData.story?.id}` }
              style={{ textDecoration: "none" }}
            >
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
  };

  /**
   * Renders title
   */
  const renderPageTitle = () => {
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
              //
            </Typography>
          </Box>
          <Typography color="textSecondary">
            { pageTitle }
          </Typography>
        </Box>
      </Box>
    );
  };

  /**
   * Event handler for logout click
   */
  const onLogOutClick = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          { renderNavigation() }
          { renderPageTitle() }
          <Box
            display="flex"
            alignItems="center"
            width="fit-content"
          >
            <TextField
              select
              className={ classes.languageSelect }
              value={ locale }
              onChange={ event => {
                strings.setLanguage(event.target.value);
                onSetLocale(event.target.value);
              }}
            >
              {
                strings.getAvailableLanguages().map(language =>
                  <MenuItem key={ language } value={ language } className={ classes.languageOption }>
                    { language }
                  </MenuItem>)
              }
            </TextField>
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
            <Box
              ml={ 2 }
              display="flex"
              alignItems="center"
            >
              <Typography color="textSecondary">
                { firstName }
                {" "}
                { lastName }
              </Typography>
              <Box ml={ 1 }>
                <Typography color="textSecondary">
                  //
                </Typography>
              </Box>
              <Button
                variant="text"
                onClick={ onLogOutClick }
              >
                { strings.header.signOut }
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box className={ classes.root }>
        { children }
      </Box>
    </>
  );
};

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 * @returns state from props
 */
const mapStateToProps = (state: ReduxState) => ({
  storyData: state.story.storyData,
  locale: state.locale.locale
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({
  onSetLocale: (locale: string) => dispatch(setLocale(locale))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appLayoutStyles)(AppLayout));