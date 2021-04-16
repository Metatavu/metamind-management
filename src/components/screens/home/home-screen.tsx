import { Box, Button, Divider, Drawer, List, ListItem, ListItemText, Typography, WithStyles, withStyles } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./home-screen.styles";
import { History } from "history";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  accessToken: AccessToken;
}

/**
 * Interface describing component state
 */
interface State {
}

/**
 * Home screen component
 */
class HomeScreen extends React.Component<Props, State> {

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
   * Component render
   */
  public render = () => {
    const { classes } = this.props;

    return (
      <AppLayout pageTitle={ strings.homeScreen.title }>
        { this.renderRightToolbar() }
        <Box className={ classes.root }>
          { this.renderSelectStoryCard() }
        </Box>
      </AppLayout>
    );
  }

  /**
   * Renders left toolbar
   */
  private renderRightToolbar = () => {
    return (
      <Drawer
        variant="permanent"
        anchor="right"
      >
        <Toolbar/>
        <Toolbar>
          <Box
            display="flex"
            flex={ 1 }
            justifyContent="center"
          >
            <Typography variant="h3">
              { strings.homeScreen.myStories }
            </Typography>
          </Box>
        </Toolbar>
        <Divider/>
      </Drawer>
    );
  }

  /**
   * Renders select story card
   */
  private renderSelectStoryCard = () => {
    const { classes } = this.props;

    return (
      <Box className={ classes.storySelectCard }>
        <Box textAlign="center" mb={ 4 }>
          <Typography color="textSecondary" variant="h1">
            { strings.homeScreen.selectStoryText }
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={ () => this.onCreateNewStoryClick() }
        >
          { strings.homeScreen.createNewStory }
        </Button>
        { this.renderRecentStories() }
      </Box>
    );
  }

  /**
   * Renders recent edited stories
   */
  private renderRecentStories = () => {
    const { classes } = this.props;

    return (
      <Box mt={ 4 }>
        <Box textAlign="center" mb={ 2 }>
          <Typography variant="h4" color="primary">
            { strings.homeScreen.lastEditedStories }
          </Typography>
        </Box>
          <List dense style={{ backgroundColor: "#090909" }}>
            <ListItem button>
              <ListItemText
                className={ classes.listItemText }
                primary="Story name"
                secondary={`${strings.generic.edited}: 12.4.2021 12:34`}
              />
            </ListItem>
          </List>
      </Box>
    );
  }
  
  /**
   * Event handler for create new story click
   */
  private onCreateNewStoryClick = () => {
    // TODO: Not yet implemented
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
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomeScreen));
