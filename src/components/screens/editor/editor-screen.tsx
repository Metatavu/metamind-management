import { Box, Drawer, Tab, Tabs, TextField, Button } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
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
import { CustomNodeModel } from "../../diagram-components/custom-node/custom-node-model";
import { useEditorScreenStyles } from "./editor-screen.styles";
import { useParams } from "react-router-dom";

/**
 * Component props
 */
interface Props {
  keycloak?: KeycloakInstance;
  accessToken?: AccessToken;
}

/**
 * Story data
 */
interface StoryData {
  story?: Story;
  knots?: Knot[];
  intents?: Intent[];
  selectedKnot?: Knot;
}

/**
 * Editor screen component
 *
 * @param props component properties
 */
const EditorScreen: React.FC<Props> = ({
  accessToken,
  keycloak
}) => {
  const { storyId } = useParams<{ storyId: string }>();
  const classes = useEditorScreenStyles();

  const [ storyData, setStoryData ] = React.useState<StoryData>({});
  const { story, knots, selectedKnot, intents } = storyData;
  const [ leftToolBarIndex, setLeftToolBarIndex ] = React.useState(0);
  const [ rightToolBarIndex, setRightToolBarIndex ] = React.useState(0);
  const [ addingKnots, setAddingKnots ] = React.useState(false);
  const [ dataChanged, setDataChanged ] = React.useState(false);
  const [ editingEntityInfo, setEditingEntityInfo ] = React.useState(false);

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  /**
   * Event handler for add node
   *
   * @param node added node
   */
  const onAddNode = async (node: CustomNodeModel) => {
    if (!accessToken || !knots) {
      return;
    }

    const createdKnot = await Api.getKnotsApi(accessToken).createKnot({
      storyId: storyId,
      knot: {
        name: "New Knot",
        content: "",
        tokenizer: TokenizerType.UNTOKENIZED,
        type: KnotType.TEXT,
        coordinates: node.getPosition()
      }
    });

    setStoryData({
      ...storyData,
      knots: [ ...knots, createdKnot ]
    });
  }

  /**
   * Event handler for node move
   *
   * @param movedNode moved node
   * @param knot knot that needs update
   */
  const onMoveNode = async (movedNode: CustomNodeModel, knot?: Knot) => {
    if (!accessToken || !knots || !knot?.id) {
      return;
    }

    const updatedKnot = await Api.getKnotsApi(accessToken).updateKnot({
      storyId: storyId,
      knotId: knot.id,
      knot: { ...knot, coordinates: movedNode.getPosition() }
    });

    setStoryData({
      ...storyData,
      knots: knots.map(knot => knot.id === updatedKnot.id ? updatedKnot : knot)
    });
  }

  /**
   * Event handler for remove node
   *
   * @param removedNodeId Removed node id (knot ID)
   */
  const onRemoveNode = async (removedNodeId: string) => {
    if (!accessToken || !knots) {
      return;
    }

    await Api.getKnotsApi(accessToken).deleteKnot({
      storyId: storyId,
      knotId: removedNodeId,
    });

    setStoryData({
      ...storyData,
      knots: knots.filter(knot => knot.id !== removedNodeId)
    });
  }

  /**
   * Event handler for add link
   *
   * @param sourceNodeId link (intent) source node (knot) id
   * @param targetNodeId link (intent) target node (knot) id
   */
  const onAddLink = async (sourceNodeId: string, targetNodeId: string) => {
    if (!accessToken || !intents) {
      return;
    }

    const createdIntent = await Api.getIntentsApi(accessToken).createIntent({
      storyId: storyId,
      intent: {
        name: "New intent name",
        global: false,
        sourceKnotId: sourceNodeId,
        targetKnotId: targetNodeId,
        quickResponseOrder: 0,
        trainingMaterials: {},
        type: IntentType.NORMAL
      }
    });

    setStoryData({
      ...storyData,
      intents: [ ...intents, createdIntent ]
    });
  }

  /**
   * Event handler for remove link
   *
   * @param linkId removed link (intent) id
   */
  const onRemoveLink = async (linkId: string) => {
    if (!accessToken || !intents) {
      return;
    }

    await Api.getIntentsApi(accessToken).deleteIntent({
      storyId: storyId,
      intentId: linkId
    });

    setStoryData({
      ...storyData,
      intents: intents.filter(intent => intent.id !== linkId)
    });
  }

  /**
   * Fetches knots list for the story
   */
  const fetchData = async () => {
    if (!accessToken) {
      return;
    }

    const [ story, knotList, intentList ] = await Promise.all([
      Api.getStoriesApi(accessToken).findStory({ storyId }),
      Api.getKnotsApi(accessToken).listKnots({ storyId }),
      Api.getIntentsApi(accessToken).listIntents({ storyId })
    ]);

    setStoryData({
      story: story,
      knots: knotList,
      intents: intentList
    });
  }

  /**
   * Renders left toolbar
   */
  const renderLeftToolbar = () => {
    return (
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar/>
        <Tabs
          onChange={ (event, value: number) => setLeftToolBarIndex(value) }
          value={ leftToolBarIndex }
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
          { leftToolBarIndex === 0 && <KnotPanel knots={ knots ?? [] }/> }
          { leftToolBarIndex === 1 && <IntentPanel intents={ intents ?? [] }/> }
        </Box>
      </Drawer>
    );
  }

  /**
     * Renders main editor area
     */
  const renderEditorContent = () => {
    if (!knots || !intents) {
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
          { renderActionButtons() }
        </Toolbar>
        <Divider variant="fullWidth" style={{ backgroundColor: "white" }}/>
        <Box className={ classes.editorContainer }>
          <StoryEditorView
            knots={ knots }
            intents={ intents }
            addingKnots={ addingKnots }
            onAddNode={ onAddNode }
            onMoveNode={ onMoveNode }
            onRemoveNode={ onRemoveNode }
            onAddLink={ onAddLink }
            onRemoveLink={ onRemoveLink }
            editingEntityInfo={ editingEntityInfo }
          />
        </Box>
      </Box>
    );
  }

  /**
   * Renders toolbar action buttons
   */
  const renderActionButtons = () => {
    return (
      <Button
        variant="contained"
        onClick={ () => setAddingKnots(!addingKnots) }
      >
        { strings.editorScreen.add.knot }
      </Button>
    );
  }

  /**
   * Renders right toolbar
   */
  const renderRightToolbar = () => {
    return (
      <Drawer
        variant="permanent"
        anchor="right"
      >
        <Toolbar/>
        <Tabs
          onChange={ (event, value: number) => setRightToolBarIndex(value) }
          value={ rightToolBarIndex } 
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
          { rightToolBarIndex === 0 && renderStoryTab() }
          { rightToolBarIndex === 1 && renderDetailsTab() }
          { rightToolBarIndex === 2 && renderLinkingTab() }
        </Box>
      </Drawer>
    );
  }

  /**
   * Renders story tab of right toolbar
   */
  const renderStoryTab = () => {
    return (
      <TextField
        label={ strings.editorScreen.rightBar.storyNameHelper }
        defaultValue={ story?.name }
      />
    );
  }

  /**
   * Renders details tab if global knot is selected  
   */
  const renderDetailsTab = () => {
    return (
      <Box>
        <TextField
          label={ strings.editorScreen.rightBar.knotNameHelper }
          defaultValue={ selectedKnot?.name }
          onFocus={ () => setEditingEntityInfo(true) }
          onBlur={ () => setEditingEntityInfo(false) }
        />
        <Divider/>
        { renderKnotDetails(selectedKnot?.name) }
      </Box>
    )
  }

  /**
   * Renders detailed tab of knot details
   * 
   * @param currentKnot current knot
   */
  const renderKnotDetails = (currentKnot?: String) => {
    return null;
  }

  /**
   * Renders right toolbar linking tab
   */
  const renderLinkingTab = () => {
    return null;
  }

  if (!keycloak) {
    return null;
  }

  return (
    <AppLayout
      keycloak={ keycloak }
      pageTitle={ storyData.story?.name ?? "" }
      dataChanged={ dataChanged }
      storySelected
    >
      { renderLeftToolbar() }
      { renderEditorContent() }
      { renderRightToolbar() }
    </AppLayout>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorScreen);
