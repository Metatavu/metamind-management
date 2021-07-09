import { Box, Button, Fade, IconButton, List, ListItem, ListItemText, Typography, WithStyles, withStyles, TextField, Divider, MenuItem, Toolbar } from "@material-ui/core";
import { History } from "history";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { KnotScope, KnotType, Story, TokenizerType } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./home-screen.styles";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import { DropzoneArea } from "material-ui-dropzone";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

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
  cardShown: "SELECT" | "CREATE" | "IMPORT";
  newStoryName: string;
  storyFile?: File;
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
      stories: [],
      cardShown: "SELECT",
      newStoryName: ""
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
          <Toolbar />
          <Box className={ classes.cardWrapper }>
            { this.renderCardShown() }
          </Box>
        </Box>
      </AppLayout>
    );
  }

  /**
   * Renders card shown
   */
  public renderCardShown = () => {
    const { cardShown } = this.state;

    switch (cardShown) {
      case "SELECT":
        return this.renderSelectStoryCard();
      case "CREATE":
        return this.renderCreateStory()
      case "IMPORT":
        return this.renderImportStory()
      default: 
        return this.renderSelectStoryCard();
    }
  }

  /**
   * Renders import story card
   */
  private renderImportStory = () => {
    const { classes } = this.props;
    const { storyFile } = this.state;

    return (
      <Box className={ classes.cardContent }>
        <Box className={ classes.cardHeader }>
          <Box className={ classes.backButtonContainer }>
            <IconButton
              title={ strings.header.settings }
              color="secondary"
              onClick={ this.onReturnButtonClick }
            >
              <NavigateBeforeIcon/>
            </IconButton>
          </Box>
          <Typography color="textSecondary" variant="h1">
            { strings.homeScreen.importStory }
          </Typography>
        </Box>
        { !storyFile &&
          <Box p={ 2 } mb={ 2 }>
            <DropzoneArea
              acceptedFiles={ [ ".json" ] }
              clearOnUnmount
              dropzoneText={ strings.homeScreen.dropFileHere }
              onDrop={ this.onFilesDropped }
              dropzoneClass={ classes.dropzone }
              showPreviewsInDropzone={ false }
              maxFileSize={ 2 * 1000000 }
              filesLimit={ 1 }
            />
          </Box>
        }
        { storyFile &&
          <>
            { this.renderPreview() }
            <Button
              variant="outlined"
              color="secondary"
              onClick={ () => console.log("TODO") }
            >
              { strings.homeScreen.importStory }
            </Button>
          </>
        }
      </Box>
    );
  }

  /**
   * Renders create story card
   */
  private renderCreateStory = () => {
    const { classes } = this.props;
    const { newStoryName } = this.state;

    return (
      <Box className={ classes.cardContent }>
        <Box className={ classes.cardHeader }>
          <Box className={ classes.backButtonContainer }>
            <IconButton
              title={ strings.header.settings }
              color="secondary"
              onClick={ this.onReturnButtonClick }
            >
              <NavigateBeforeIcon/>
            </IconButton>
          </Box>
          <Typography color="textSecondary" variant="h1">
            { strings.homeScreen.nameTheStory }
          </Typography>
        </Box>
        <Box p={ 2 } mb={ 2 }>
          <TextField
            className={ classes.textField }
            InputProps={{ className: classes.textInput }}
            label={ strings.homeScreen.storyName }
            title={ strings.homeScreen.storyName }
            value={ newStoryName }
            onChange={ this.onStoryNameChange }
            variant="outlined"
          />
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={ this.onCreateNewStoryClick }
        >
          { strings.homeScreen.createNewStory }
        </Button>
      </Box>
    );
  }

  /**
   * Renders select story card
   */
  private renderSelectStoryCard = () => {
    const { classes } = this.props;
    const { selectedStoryId } = this.state;

    return (
      <Box className={ classes.cardContent }>
        <Box className={ classes.cardHeader }>
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
        <Box 
          mb={ 1 }
          mt={ 1 }
        ></Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={ this.onImportStoryClick }
        >
          { strings.homeScreen.importStory }
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
   * Renders selected file  preview
   */
  private renderPreview = () => {
    const { classes } = this.props;
    const { storyFile } = this.state;
    if (!storyFile) {
      return null;
    }

    return (
      <Box className={ classes.previewItem }>
        <Typography variant="h4" color="textSecondary">
          { storyFile.name }
        </Typography>
        <Box className={ classes.removeButtonContainer }>
          <IconButton
            color="secondary"
            onClick={ () => this.setState({ storyFile: undefined }) }
          >
            <HighlightOffIcon/>
          </IconButton>
        </Box>
      </Box>
    );
  }

  /**
   * Event handler for import story click
   * 
   * @returns 
   */
  private onImportStoryClick = () => {
    const { accessToken } = this.props;
    const { cardShown } = this.state;

    if (cardShown === "SELECT" || !accessToken) {
      this.setState({ cardShown: "IMPORT" });
      return;
    }
    // TODO: implement importing of story from the .xml file
    return;
  }
  
  /**
   * Event handler for create new story click
   */
  private onCreateNewStoryClick = async () => {
    const { accessToken } = this.props;
    const { cardShown, newStoryName } = this.state;

    if (cardShown === "SELECT" || !accessToken) {
      this.setState({ cardShown: "CREATE" });
      return;
    }
    
    const createdStory = await Api.getStoriesApi(accessToken).createStory({
      story: {
        locale: strings.getLanguage(),
        name: newStoryName
      }
    });

    if (createdStory.id) {
      const knotsApi = Api.getKnotsApi(accessToken);
      const globalKnot = await knotsApi.createKnot({
        storyId: createdStory.id,
        knot: {
          name: "Global",
          type: KnotType.TEXT,
          scope: KnotScope.Global,
          tokenizer: TokenizerType.WHITESPACE,
          content: "",
          coordinates: { x: 200, y: 100 }
        }
      });

      const homeKnot = await knotsApi.createKnot({
        storyId: createdStory.id,
        knot: {
          name: "Home",
          type: KnotType.TEXT,
          scope: KnotScope.Home,
          tokenizer: TokenizerType.WHITESPACE,
          content: "",
          coordinates: { x: 200, y: 400 }
        }
      });

      this.setState({
        stories: [ ...this.state.stories, createdStory ],
        selectedStoryId: createdStory.id ?? this.state.selectedStoryId
      });
      this.props.history.push(`editor/${createdStory.id}`);
    }
    
  }

  /**
   * Event handler for return button click
   */
  private onReturnButtonClick = () => {
    this.setState({
      cardShown: "SELECT",
      newStoryName: "",
      storyFile: undefined
    });
  }

  /**
   * Event handler for story name change
   * 
   * @param event change event
   */
  private onStoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (!value) {
      return;
    }

    this.setState({ 
      newStoryName: value 
    });
  }

  /**
   * Event handler for files drop
   * 
   * @param file dropped file
   */
  onFilesDropped = (files: File[]) => {
    if (!files?.length) {
      return;
    }

    this.setState({ 
      storyFile: files[0] 
    });
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
