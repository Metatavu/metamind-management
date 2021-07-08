import { Box, Button, List, ListItem, ListItemText, Typography, WithStyles, withStyles, TextField, Divider, MenuItem } from "@material-ui/core";
import { History } from "history";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { Cookies } from "react-cookie";
import Carousel from "react-material-ui-carousel";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { Story, KnotType,TokenizerType, KnotScope } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken, RecentStory } from "../../../types";
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
  recentStories?: RecentStory[];
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
    const { classes, history } = this.props;
    const { recentStories } = this.state;

    return (
      <Box mt={ 4 }>
        <Box textAlign="center" mb={ 2 }>
          <Typography variant="h4" color="primary">
            { strings.homeScreen.lastEditedStories }
          </Typography>
        </Box>
          <Carousel
            autoPlay = { false }
            className={ classes.carousel }
            navButtonsProps={{ style: { margin: 0 } }}
            indicatorContainerProps={{ style: { marginTop: 0 } }}
          >
            { recentStories && recentStories?.map(recentStory => (
              <ListItem 
                button
                onClick={ () => history.push(`/editor/${recentStory.id}`) }
              >
                <ListItemText
                  className={ classes.listItemText }
                  primary={ recentStory.name }
                  secondary={`${strings.generic.edited}: ${recentStory.lastEditedTime}`}
                />
              </ListItem>
            )) }
          </Carousel>
      </Box>
    );
  }
  
  /**
   * Event handler for create new story click
   */
  private onCreateNewStoryClick = async () => {
    //TODO: Proper implementation
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    const story = await Api.getStoriesApi(accessToken).createStory({
      story: {
        name: "Global & home knots tester",
        locale: "fi"
      }
    });

    if (story.id) {
      
      const knotsApi = Api.getKnotsApi(accessToken);
      const globalKnot = await knotsApi.createKnot({
        storyId: story.id,
        knot: {
          name: "Global",
          type: KnotType.TEXT,
          scope: KnotScope.Global,
          tokenizer: TokenizerType.UNTOKENIZED,
          content: ""
        }
      });

      const homeKnot = await knotsApi.createKnot({
        storyId: story.id,
        knot: {
          name: "Home",
          type: KnotType.TEXT,
          scope: KnotScope.Home,
          tokenizer: TokenizerType.UNTOKENIZED,
          content: ""
        }
      });

      this.setState({ selectedStoryId: story.id });
    }
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
      const stories = await Api.getStoriesApi(accessToken).listStories();
      this.setState({ stories });

      const cookies = new Cookies();
      const recentStories = cookies.get("recentStories");

      this.setState({
        recentStories: recentStories 
      });
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
