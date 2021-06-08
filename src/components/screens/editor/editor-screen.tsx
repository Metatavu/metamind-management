import { Box, Drawer, Tab, Tabs, TextField, WithStyles, withStyles, Button } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import { History } from "history";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { TokenizerType, KnotType, Story, Knot, Intent, IntentType } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import IntentPanel from "../../panels/intent-panel";
import KnotPanel from "../../panels/knot-panel";
import StoryEditorView from "../../views/story-editor-view";
import GlobalEditorView from "../../views/global-editor-view";
import { styles } from "./editor-screen.styles";
import { CustomNodeModel } from "../../diagram-components/custom-node/custom-node-model";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak?: KeycloakInstance;
  accessToken?: AccessToken;
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
  storyKnots?: Knot[];
  storyIntents: Intent[];
  currentKnot?: Knot;
  currentStory?: Story;
  storyId?: string;
  dataChanged: boolean;
  addingKnots: boolean;
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
      storyIntents: [],
      dataChanged: false,
      addingKnots: false
    };
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
    const { keycloak } = this.props;
    const { dataChanged } = this.state;

    if (!keycloak) {
      return;
    }

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
          { leftToolbarIndex === 0 && <KnotPanel knots={ storyKnots || [] }/> }
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
    const { editorTabIndex, storyKnots, storyIntents, addingKnots } = this.state;

    if (!storyKnots) {
      return;
    }

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
          { this.renderActionButtons() }
        </Toolbar>
        <Divider variant="fullWidth" style={{ backgroundColor: "white" }}/>
        <Box className={ classes.editorContainer }>
          {
            editorTabIndex === 0 && 
              <StoryEditorView
                knots={ storyKnots }
                intents={ storyIntents }
                addingKnots={ addingKnots }
                onAddNode={ this.onAddNode }
                onMoveNode={ this.onMoveNode }
                onRemoveNode={ this.onRemoveNode }
                onAddLink={ this.onAddLink }
                onRemoveLink={ this.onRemoveLink }
              />
          }
          { editorTabIndex === 1 && <GlobalEditorView/> }
        </Box>
      </Box>
    );
  }

  /**
   * Renders toolbar action buttons
   */
  private renderActionButtons = () => {
    return (
      <Button
        variant="contained"
        onClick={ () => this.setState({ addingKnots: !this.state.addingKnots }) }
      >
        { strings.editorScreen.add.knot }
      </Button>
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
   * Event handler for add node
   *
   * @param node added node
   */
  private onAddNode = async (node: CustomNodeModel) => {
    const { accessToken, storyId } = this.props;

    if (!accessToken) {
      return;
    }

    const { x, y } = node.getPosition();
    const newKnot: Knot = {
      name: "New Knot",
      content: "",
      tokenizer: TokenizerType.UNTOKENIZED,
      type: KnotType.TEXT,
      coordinates: {
        x: x,
        y: y
      }
    };

    const knotsApi = Api.getKnotsApi(accessToken);
    const createdKnot = await knotsApi.createKnot({
      storyId: storyId,
      knot: newKnot
    });

    //TODO: add support for created knot
  }

  /**
   * Event handler for node move
   *
   * @param movedNode moved node
   * @param knot knot that needs update
   */
  private onMoveNode = async (movedNode: CustomNodeModel, knot?: Knot) => {
    const { accessToken, storyId } = this.props;

    if (!accessToken || !knot || !knot.id) {
      return;
    }

    const { x, y } = movedNode.getPosition();

    const knotsApi = Api.getKnotsApi(accessToken);
    const updatedKnot = await knotsApi.updateKnot({
      storyId: storyId,
      knotId: knot.id,
      knot: { ...knot, coordinates: { x, y } }
    });

    //TODO: add support for update node list
  }

  /**
   * Event handler for remove node
   *
   * @param removedNodeId Removed node id (knot ID)
   */
  private onRemoveNode = async (removedNodeId: string) => {
    const { accessToken, storyId } = this.props;

    if (!accessToken) {
      return;
    }

    const knotsApi = Api.getKnotsApi(accessToken);
    await knotsApi.deleteKnot({
      storyId: storyId,
      knotId: removedNodeId,
    });
  }

  /**
   * Event handler for add link
   *
   * @param sourceNodeId link (intent) source node (knot) id
   * @param targetNodeId link (intent) target node (knot) id
   */
  private onAddLink = async (sourceNodeId: string, targetNodeId: string) => {
    const { accessToken, storyId } = this.props;

    if (!accessToken) {
      return;
    }

    const newIntent: Intent = {
      name: "New intent name",
      global: false,
      sourceKnotId: sourceNodeId,
      targetKnotId: targetNodeId,
      quickResponseOrder: 0,
      trainingMaterials: {},
      type: IntentType.NORMAL
    };

    const intentsApi = Api.getIntentsApi(accessToken);
    const createdIntent = await intentsApi.createIntent({
      storyId: storyId,
      intent: newIntent
    });

    //TODO: add support for update node list
  }

  /**
   * Event handler for remove link
   *
   * @param linkId removed link (intent) id
   */
  private onRemoveLink = async (linkId: string) => {
    const { accessToken, storyId } = this.props;

    if (!accessToken) {
      return;
    }

    const intentsApi = Api.getIntentsApi(accessToken);
    await intentsApi.deleteIntent({
      storyId: storyId,
      intentId: linkId
    });

    //TODO: add support for update node list
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
   * Fetches knots list for the story
   */
  private fetchData = async () => {
    const { accessToken, storyId } = this.props;

    if (!accessToken) {
      return;
    }

    const storiesApi = Api.getStoriesApi(accessToken)
    const knotsApi = Api.getKnotsApi(accessToken)
    const intentsApi = Api.getIntentsApi(accessToken)

    const [ story, knotList, intentList ] = await Promise.all([
      storiesApi.findStory({ storyId }),
      knotsApi.listKnots({ storyId }),
      intentsApi.listIntents({ storyId })
    ]);

    this.setState({
      currentStory: story,
      storyKnots : knotList,
      storyIntents: intentList
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
  accessToken: state.auth.accessToken,
  keycloak: state.auth.keycloak
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditorScreen));