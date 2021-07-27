import * as React from "react";
import { AppBar, Toolbar, withStyles, WithStyles, Box, Button, Typography, TextField, MenuItem } from "@material-ui/core";
import { styles } from "./app-layout.styles";
import Logo from "../../../resources/svg/logo";
import strings from "../../../localization/strings";
import { Link } from "react-router-dom";
import EditorIcon from "@material-ui/icons/Edit";
import PreviewIcon from "@material-ui/icons/PlayArrow";
import SaveIcon from "@material-ui/icons/Save";
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
  locale?: string;
  setLocale: (locale: string) => void;
  children: React.ReactNode;
}

/**
 * App layout component. Provides the basic page layout with a header
 */
const AppLayout: React.FC<Props> = ({
  onSaveClick,
  dataChanged,
  storySelected,
  pageTitle,
  storyId,
  keycloak,
  locale,
  setLocale,
  classes,
  children
}) => {

  const firstName = (keycloak.profile && keycloak.profile.firstName) ?? "";
  const lastName = (keycloak.profile && keycloak.profile.lastName) ?? "";


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
  const onLogOutClick = () => {

    if (keycloak) {
      keycloak.logout();
    }
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          { renderNavigation() }
          { renderPageTitle() }
          <Box display="flex" alignItems="center" width="fit-content">
            <TextField
              select
              className={ classes.languageSelect }
              value={ locale }
              onChange={
                event => { 
                  strings.setLanguage(event.target.value)
                  setLocale(event.target.value)
                } 
              }
            >
            {
              strings.getAvailableLanguages().map(language =>
                <MenuItem key={ language } value={ language } className={ classes.languageOption }>
                  { language }
                </MenuItem>
              )
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
            <Box ml={ 2 } display="flex" alignItems="center">
              <Typography color="textSecondary">
                { firstName } { lastName }
              </Typography>
              <Box ml={ 1 }>
                <Typography color="textSecondary">{ "//" }</Typography>
              </Box>
              <Button
                variant="text"
                onClick={ () => onLogOutClick() }
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
}

export default withStyles(styles)(AppLayout);
