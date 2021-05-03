import { Box, Drawer, Tab, Tabs, TextField, WithStyles, withStyles } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import { History } from "history";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { Intent } from "../../../generated/client/models/Intent";
import { Knot } from "../../../generated/client/models/Knot";
import { Story } from "../../../generated/client/models/Story";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import IntentPanel from "../../panels/intent-panel";
import KnotPanel from "../../panels/knot-panel";
import StoryEditorView from "../../views/story-editor-view";
import GlobalEditorView from "../../views/global-editor-view";
import { styles } from "./editor-screen.styles";

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
  error?: Error;
  leftToolbarIndex: number;
  rightToolbarIndex: number;
  editorTabIndex: number;
  storyKnots: Knot[];
  storyIntents: Intent[];
  currentKnot?: Knot;
  currentStory?: Story;
  storyId?: String;
  dataChanged: boolean;
}

/**
 * Editor screen component
 */
class EditorScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      leftToolbarIndex: 0,
      rightToolbarIndex: 0,
      editorTabIndex: 0,
      storyKnots: [],
      storyIntents: [],
      dataChanged: false
    };
  }

  /**
   * Component did mount life cycle handler
   */
  public componentDidMount = () => {
    this.fetchData();
  }

  /**
   * Component render
   */
  public render = () => {
    const { keycloak } = this.props;
    const { dataChanged } = this.state;

    return (
      <AppLayout
        keycloak={ keycloak }
        pageTitle="Story name here"
        dataChanged={ dataChanged }
        storySelected={ true }
      >
        { this.renderLeftToolbar() }
        { this.renderEditorContent() }
        { this.renderRightToolbar() }
      </AppLayout>
    );
  }

  /**
   * Renders left toolbar
   */
  private renderLeftToolbar = () => {
    const {
      leftToolbarIndex,
      storyKnots,
      storyIntents
    } = this.state;

    return (
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar/>
        <Tabs
          onChange={ this.setLeftTabIndex }
          value={ leftToolbarIndex }
        >
          <Tab
            fullWidth
            value={ 0 }
            label={ strings.editorScreen.leftBar.knotsLeftTab }
          />
          <Tab
            fullWidth
            value={ 1 }
            label={ strings.editorScreen.leftBar.intentsLeftTab }
          />
        </Tabs>
        <Box>
          { leftToolbarIndex === 0 && <KnotPanel knots={ storyKnots }/> }
          { leftToolbarIndex === 1 && <IntentPanel intents={ storyIntents }/> }
        </Box>
      </Drawer>
    );
  }

  /**
   * Renders main editor area
   */
  private renderEditorContent = () => {
    const { classes } = this.props;
    const { editorTabIndex } = this.state;

    return (
      <Box
        marginLeft="320px"
        marginRight="320px"
        height="100%"
      >
        <Toolbar/>
        <Toolbar>
          <Tabs
            onChange={ this.setEditorTabIndex }
            value={ editorTabIndex }
            className={ classes.tabs }
          >
            <Tab
              value={ 0 }
              className={ classes.tab }
              label={ strings.editorScreen.storyEditor }
            />
            <Tab
              value={ 1 }
              className={ classes.tab }
              label={ strings.editorScreen.globalEditor }
            />
          </Tabs>
        </Toolbar>
        <Box className={ classes.editorContainer }>
          { editorTabIndex === 0 && <StoryEditorView/> }
          { editorTabIndex === 1 && <GlobalEditorView/> }
        </Box>
      </Box>
    );
  }

  /**
   * Renders right toolbar
   */
  private renderRightToolbar = () => {
    const { rightToolbarIndex } = this.state;

    return (
      <Drawer
        variant="permanent"
        anchor="right"
      >
        <Toolbar/>
        <Tabs
          onChange={ this.setRightTabIndex }
          value={ rightToolbarIndex } 
        >
          <Tab
            value={ 0 }
            label={ strings.editorScreen.rightBar.storyRightTab }
          />
          <Tab
            value={ 1 }
            label={ strings.editorScreen.rightBar.detailsRightTab }
          />
          <Tab
            value={ 2 }
            label={ strings.editorScreen.rightBar.linkingRightTab }
          />
        </Tabs>
        <Box p={ 2 }>
          { rightToolbarIndex === 0 && this.renderStoryTab() }
          { rightToolbarIndex === 1 && this.renderDetailsTab() }
          { rightToolbarIndex === 2 && this.renderLinkingTab() }
        </Box>
      </Drawer>
    );
  }

  /**
   * Sets left tab index
   * 
   * @param event event object
   * @param newValue new tab index value
   */
  private setLeftTabIndex = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({
      leftToolbarIndex: newValue
    });
  }

  /**
   * Sets right tab index
   * 
   * @param event event object
   * @param newValue new tab index value
   */
  private setRightTabIndex = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({
      rightToolbarIndex: newValue
    });
  }

  /**
   * Sets editor tab index
   *
   * @param event event object
   * @param newValue new tab index value
   */
  private setEditorTabIndex = (event: React.ChangeEvent<{ }>, newValue: number) => {
    this.setState({ editorTabIndex: newValue });
  }

  /**
   * Renders story tab of right toolbar
   */
  private renderStoryTab = () => {
    const { currentStory } = this.state;

    return (
      <TextField
        label={ strings.editorScreen.rightBar.storyNameHelper }
        defaultValue={ currentStory?.name }
      />
    );
  }

  /**
   * Renders details tab if global knot is selected  
   */
  private renderDetailsTab = () => {
    const { currentKnot } = this.state;

    return (
      <Box>
        <TextField
          label={ strings.editorScreen.rightBar.knotNameHelper }
          defaultValue={ currentKnot?.name }
        />
        <Divider/>
        { this.renderKnotDetails(currentKnot?.name) }
      </Box>
    )
  }

  /**
   * Renders detailed tab of knot details
   * 
   * @param currentKnot current knot
   */
  private renderKnotDetails = (currentKnot?: String) => {
    return null;
  }

  /**
   * Renders right toolbar linking tab
   */
  private renderLinkingTab = () => {
    return null;
  }

  /**
   * Fetches knots list for the story
   */
  private fetchData = async() => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    const storiesApi = Api.getStoriesApi(accessToken)
    const knotsApi = Api.getKnotsApi(accessToken)
    const intentsApi = Api.getIntentsApi(accessToken)

    const stories = await storiesApi.listStories();
    const mainStory = stories.length ? stories[0] : undefined;

    if (!mainStory) {
      return;
    }

    const mainStoryId = mainStory.id || "";

    const [ knotList, intentList ] = await Promise.all([
      knotsApi.listKnots({ storyId: mainStoryId }),
      intentsApi.listIntents({ storyId: mainStoryId })
    ]);

    this.setState({
      currentStory: mainStory,
      storyKnots : knotList,
      storyIntents: intentList
    });
  }

  /**
   * Clears all test data
   */
  private clearTestData = async() => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    const storiesApi = Api.getStoriesApi(accessToken)
    const knotsApi = Api.getKnotsApi(accessToken)
    const intentsApi = Api.getIntentsApi(accessToken)

    const allStories = await storiesApi.listStories();

    allStories.forEach(async (story) => {
      const storyId: string = story.id || "";

      const [ allKnots, allIntents ] = await Promise.all([
        knotsApi.listKnots({ storyId: storyId }),
        intentsApi.listIntents({ storyId: storyId })
      ]);

      //remove all knots
      allKnots.forEach(knot => {
        const knotId = knot.id || "";
        knotsApi.deleteKnot(
          {
            storyId: storyId,
            knotId: knotId
          }
        );
      });

      //remove all intents
      allIntents.forEach(intent => {
        const intentId: string = intent.id as string;
        intentsApi.deleteIntent(
          {
            storyId: storyId,
            intentId: intentId
          }
        );
      });
    });
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
  keycloak: state.auth.keycloak as KeycloakInstance
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditorScreen));
