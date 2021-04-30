import { Box, Drawer, Tab, Tabs, TextField, Typography, WithStyles, withStyles } from "@material-ui/core";
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
import { KnotType } from "../../../generated/client/models/KnotType";
import { Story } from "../../../generated/client/models/Story";
import { TokenizerType } from "../../../generated/client/models/TokenizerType";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import IntentPanel from "../../panels/intent-panel";
import KnotPanel from "../../panels/knot-panel";
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
              label={ strings.editorScreen.story }
            />
            <Tab
              value={ 1 }
              className={ classes.tab }
              label={ strings.editorScreen.global }
            />
          </Tabs>
        </Toolbar>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          { editorTabIndex === 0 && this.renderStoryEditor() }
          { editorTabIndex === 1 && this.renderGlobalEditor() }
        </Box>
      </Box>
    );
  }

  /**
   * Renders main editor area
   *
   * TODO: replace content with editor
   */
  private renderStoryEditor = () => {
    return (
      <Box>
        <Typography color="primary">
          { strings.editorScreen.story }
        </Typography>
      </Box>
    );
  }

  /**
   * Renders main editor area
   *
   * TODO: replace content with editor
   */
  private renderGlobalEditor = () => {
    return (
      <Box>
        <Typography color="primary">
          { strings.editorScreen.global }
        </Typography>
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

  /**
  * Creates test story and knots for it
  */
  private createTestData = async() => {
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }
    const storiesApi = Api.getStoriesApi(accessToken);
    const knotsApi = Api.getKnotsApi(accessToken);
    const intentsApi = Api.getIntentsApi(accessToken);

    const basicKnot0: Knot = {
      name: "basic0",
      type: KnotType.TEXT,
      tokenizer: TokenizerType.UNTOKENIZED,
      content: "basic knot 1 text content"
    };

    const basicKnot1: Knot = {
      name: "basic1",
      type: KnotType.TEXT,
      tokenizer: TokenizerType.UNTOKENIZED,
      content: "basic knot 2 text content"
    };

    const globalKnot0: Knot = {
      name: "global0",
      type: KnotType.TEXT,
      tokenizer: TokenizerType.UNTOKENIZED,
      content: "global knot 1 text content"
    };

    const globalKnot1: Knot = {
      name: "global1",
      type: KnotType.TEXT,
      tokenizer: TokenizerType.UNTOKENIZED,
      content: "global knot 1 text content"
    };

    const story0: Story = {
      name: "story 1",
      locale: "en"
    };

    const createdStory = await storiesApi.createStory({story: story0})

    const [ knot1, knot2, knot3, knot4 ] = await Promise.all([
      knotsApi.createKnot({knot: basicKnot0, storyId: createdStory.id || ""}),
      knotsApi.createKnot({knot: basicKnot1, storyId: createdStory.id || ""}),
      knotsApi.createKnot({knot: globalKnot0, storyId: createdStory.id || ""}),
      knotsApi.createKnot({knot: globalKnot1, storyId: createdStory.id || ""})
    ]);
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
