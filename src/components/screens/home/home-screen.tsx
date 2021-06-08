import { Box, Button, List, ListItem, ListItemText, Typography, WithStyles, withStyles, TextField, Divider, MenuItem } from "@material-ui/core";
import { RestaurantMenuTwoTone } from "@material-ui/icons";
import { access } from "fs";
import { History } from "history";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { Story } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./home-screen.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  accessToken?: AccessToken;
  keycloak?: KeycloakInstance;
}

/**
 * Interface describing component state
 */
interface State {
  stories: Story[];
  selectedStoryId?: string;
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

    this.state = {
      stories: []
    }
  }

  /**
   * Component did mount life cycle handler
   */
  public componentDidMount = async () => {
    await this.fetchData();
  }

  /**
   * Component render
   */
  public render = () => {
    const { classes, keycloak } = this.props;

    if (!keycloak) {
      return null;
    }

    return (
      <AppLayout 
        pageTitle={ strings.homeScreen.title }
        keycloak={ keycloak }
      >
        <Box className={ classes.root }>
          { this.renderSelectStoryCard() }
        </Box>
      </AppLayout>
    );
  }

  /**
   * Renders select story card
   */
  private renderSelectStoryCard = () => {
    const { classes } = this.props;
    const { selectedStoryId } = this.state;

    return (
      <Box className={ classes.storySelectCard }>
        <Box textAlign="center" mb={ 4 }>
          <Typography color="textSecondary" variant="h1">
            { strings.homeScreen.selectStoryText }
          </Typography>
        </Box>
        <Box p={ 2 } mb={ 2 }>
          <TextField
            select
            className={ classes.select }
            label={ strings.homeScreen.selectStory }
            value={ selectedStoryId }
            onChange={ this.onSelectedStoryChange }
            title={ strings.homeScreen.selectStoryToEdit }
            variant="outlined"
            color="primary"
          >
            { this.renderStoryOptions() }
          </TextField>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={ this.onOpenSelectedStoryClick }
        >
          { strings.homeScreen.open }
        </Button>
        <Box 
          mb={ 4 }
          mt={ 4 }
          ml={ 2 }
          mr={ 2 }
        >
          <Divider light />
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={ this.onCreateNewStoryClick }
        >
          { strings.homeScreen.createNewStory }
        </Button>
        { this.renderRecentStories() }
      </Box>
    );
  }

  /**
   * Renders story options
   */
  private renderStoryOptions = () => {
    return this.state.stories.map(story =>
      <MenuItem value={ story.id } key={ story.id }>
        { story.name }
      </MenuItem>
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
    // TODO: add functionality
  }

  /**
   * Event handler for selected story change
   *
   * @param event React change event
   */
  private onSelectedStoryChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = event => {
    this.setState({ selectedStoryId: event.target.value });
  }

  /**
   * Event handler for selected story open click
   */
  private onOpenSelectedStoryClick = () => {
    const { selectedStoryId } = this.state;

    if (!selectedStoryId) {
      return;
    }

    this.props.history.push(`editor/${selectedStoryId}`);
  }

  /**
   * Fetches data from API
   */
  private fetchData = async () => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    try {
      const storiesApi = Api.getStoriesApi(accessToken);
      const stories = await storiesApi.listStories();
      this.setState({ stories });
    } catch (error) {
      console.error(error);
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
  accessToken: state.auth.accessToken,
  keycloak: state.auth.keycloak
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomeScreen));