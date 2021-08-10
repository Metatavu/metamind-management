import { Box, Drawer, Tab, Tabs, TextField, Button, MenuItem, InputLabel, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
// eslint-disable-next-line max-len
import { TokenizerType, KnotType, Knot, Intent, IntentType, TrainingMaterial, TrainingMaterialType, TrainingMaterialVisibility, KnotScope } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken, RecentStory, StoryData } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import IntentPanel from "../../intent-components/intent-list/intent-list";
import KnotPanel from "../../knot-components/knot-list/knot-list";
import StoryEditorView from "../../views/story-editor-view";
import CustomNodeModel from "../../diagram-components/custom-node/custom-node-model";
import useEditorScreenStyles from "./editor-screen.styles";
import { useParams } from "react-router-dom";
import CustomLinkModel from "../../diagram-components/custom-link/custom-link-model";
import AccordionItem from "../../generic/accordion-item";
import TrainingSelectionOptions from "../../intent-components/training-selection-options/training-selection-options";
import QuickResponseButton from "../../intent-components/quick-response-button/quick-response-button";
import EditorUtils from "../../../utils/editor";
import { Cookies } from "react-cookie";
import KnotLinking from "../../knot-components/knot-linking/knot-linking";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import GenericDialog from "../../generic/generic-dialog/generic-dialog";
import { loadStory, setStoryData } from "../../../actions/story";
import Loading from "../../generic/loading-item";
import DiscussionComponent from "../../knot-components/discussion-component/discussion-component";
import KnotIcon from "../../../resources/svg/knot-icon";

/**
 * Component props
 */
interface Props {
  keycloak?: KeycloakInstance;
  accessToken?: AccessToken;
  storyData?: StoryData;
  storyLoading: boolean;
  onLoadStory: typeof loadStory;
  onSetStoryData: typeof setStoryData;
}

/**
 * Editor screen component
 *
 * @param props component properties
 */
const EditorScreen: React.FC<Props> = ({
  accessToken,
  keycloak,
  storyData,
  storyLoading,
  onLoadStory,
  onSetStoryData
}) => {
  const { storyId } = useParams<{ storyId: string }>();
  const classes = useEditorScreenStyles();
  const [ centeredKnot, setCenteredKnot ] = React.useState<Knot | undefined>(undefined);
  const [ centeredIntent, setCenteredIntent ] = React.useState<Intent | undefined>(undefined);
  const [ leftToolBarIndex, setLeftToolBarIndex ] = React.useState(0);
  const [ rightToolBarIndex, setRightToolBarIndex ] = React.useState(0);
  const [ addingKnots, setAddingKnots ] = React.useState(false);
  const [ zoom100, setZoom100 ] = React.useState(false);
  const [ dataChanged, setDataChanged ] = React.useState(false);
  const [ editingEntityInfo, setEditingEntityInfo ] = React.useState(false);
  const [ editingQuickResponse, setEditingQuickResponse ] = React.useState(false);
  const [ editingTrainingMaterial, setEditingTrainingMaterial ] = React.useState(false);
  const [ selectedTrainingMaterialType, setSelectedTrainingMaterialType ] = React.useState<TrainingMaterialType | null>(null);
  const [ editedTrainingMaterial, setEditedTrainingMaterial ] = React.useState<TrainingMaterial>();
  const [ removedKnots, setRemovedKnots ] = React.useState<Knot[]>([]);
  const [ removedIntents, setRemovedIntents ] = React.useState<Intent[]>([]);
  const [ deleteConfirmDialogOpen, setDeleteConfirmDialogOpen ] = React.useState(false);
  const [ deletedKnotRef, setDeletedKnotRef ] = React.useState<Knot | undefined>(undefined);
  const [ deletedIntentRef, setDeletedIntentRef ] = React.useState<Intent | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ alertMessage, setAlertMessage ] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ alertType, setAlertType ] = React.useState<"error" | "success">("success");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ alertOpen, setAlertOpen ] = React.useState(false);
  const [ selectedEntitiesLength, setSelectedEntitiesLength ] = React.useState(0);

  /**
   * Event handler for on knot click
   * 
   * @param knot knot
   */
  const onKnotClick = (knot: Knot) => {
    if (!knot?.coordinates?.x || !knot?.coordinates?.y) {
      return;
    }
    setCenteredKnot(knot);
    onSetStoryData({
      ...storyData, selectedKnot: knot, selectedIntent: undefined
    });
  };

  /**
   * Event handler for on intent click
   * 
   * @param intent intent
   */
  const onIntentClick = (intent: Intent) => {
    if (!intent?.sourceKnotId || !intent?.targetKnotId) {
      return;
    }
    setCenteredIntent(intent);
    onSetStoryData({
      ...storyData, selectedIntent: intent, selectedKnot: undefined
    });
  };

  /**
   * Event handler for add node
   *
   * @param node added node
   */
  const onAddNode = (node: CustomNodeModel) => {
    const { knots } = storyData || {};

    if (!knots) {
      return;
    }

    const createdKnot: Knot = {
      storyId: storyId,
      name: "New Knot",
      content: "",
      scope: KnotScope.Basic,
      tokenizer: TokenizerType.UNTOKENIZED,
      type: KnotType.TEXT,
      coordinates: node.getPosition()
    };

    onSetStoryData({
      ...storyData,
      knots: [ ...knots, createdKnot ]
    });
    setDataChanged(true);
  };

  /**
   * Event handler for node move
   *
   * @param movedNode moved node
   * @param knot knot that needs update
   */
  const onMoveNode = (knotId: string, node: CustomNodeModel) => {
    const { knots } = storyData || {};

    if (!knots) {
      return;
    }

    const updatedKnot: Knot = {
      ...knots.find(knot => knot.id === knotId)!,
      coordinates: node.getPosition()
    };

    onSetStoryData({
      ...storyData,
      selectedKnot: updatedKnot,
      selectedIntent: undefined,
      knots: knots.map(item => (item.id === updatedKnot.id ? updatedKnot : item))
    });

    setDataChanged(true);
  };

  /**
   * Event handler for remove node
   *
   * @param removedNodeId Removed node id (knot ID)
   */
  const onRemoveNode = (removedNodeId: string) => {
    const { knots } = storyData || {};

    if (!knots) {
      return;
    }
    const knot = knots.find(item => item.id === removedNodeId);
    if (knot?.scope === KnotScope.Home || knot?.scope === KnotScope.Global) {
      return;
    }

    if (knot) {
      setRemovedKnots([ ...removedKnots, knot ]);
    }
    onSetStoryData({
      ...storyData,
      knots: knots.filter(item => item.id !== removedNodeId)
    });
    setDataChanged(true);
  };

  /**
   * Event handler for add link
   *
   * @param sourceNodeId link (intent) source node (knot) id
   * @param targetNodeId link (intent) target node (knot) id
   */
  const onAddLink = (sourceNodeId: string, targetNodeId: string) => {
    const { intents } = storyData || {};

    if (!intents) {
      return null;
    }

    if (!intents) {
      return;
    }

    const createdIntent: Intent = {
      name: "New intent name",
      global: false,
      sourceKnotId: sourceNodeId,
      targetKnotId: targetNodeId,
      quickResponseOrder: 0,
      trainingMaterials: {},
      type: IntentType.NORMAL
    };

    onSetStoryData({
      ...storyData,
      intents: [ ...intents, createdIntent ],
      selectedIntent: createdIntent,
      selectedKnot: undefined
    });
    setDataChanged(true);
  };

  /**
   * Event handler for remove link
   *
   * @param linkId removed link (intent) id
   */
  const onRemoveLink = (linkId: string) => {
    const { intents } = storyData || {};

    if (!intents) {
      return;
    }

    const intent = intents.find(item => item.id === linkId);
    if (intent) {
      setRemovedIntents([ ...removedIntents, intent ]);
    }

    onSetStoryData({
      ...storyData,
      intents: intents.filter(item => item.id !== linkId)
    });
    setDataChanged(true);
  };

  /**
   * Event handler for node selection change
   * 
   * @param node node
   */
  const onNodeSelectionChange = (node: CustomNodeModel) => {
    const { knots } = storyData || {};

    if (!knots) {
      return null;
    }

    if (selectedEntitiesLength !== 0) {
      onSetStoryData({
        ...storyData,
        selectedIntent: undefined,
        selectedKnot: undefined
      });
      return;
    }

    const knot = knots.find(item => item.id === node.getID());

    onSetStoryData({
      ...storyData,
      selectedIntent: undefined,
      selectedKnot: knot
    });
    if (knot?.scope && (knot?.scope === KnotScope.Home || knot?.scope === KnotScope.Global)) {
      setEditingEntityInfo(true);
    } else {
      setEditingEntityInfo(false);
    }
  };

  /**
   * Event handler for link selection change
   * 
   * @param link link
   */
  const onLinkSelectionChange = (link: CustomLinkModel) => {
    const { intents } = storyData || {};

    if (!intents) {
      return;
    }

    if (selectedEntitiesLength !== 0) {
      onSetStoryData({
        ...storyData,
        selectedIntent: undefined,
        selectedKnot: undefined
      });
      return;
    }

    const intent = intents.find(item => item.id === link.getID());

    onSetStoryData({
      ...storyData,
      selectedIntent: intent,
      selectedKnot: undefined
    });
  };

  /**
   * Event handler for set active training material change 
   * 
   * @param event event from input change
   */
  const onSetActiveTrainingMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { intents, trainingMaterial, selectedIntent } = storyData || {};
    const { name, value } = event.target;

    if (!name || !value || !trainingMaterial || !selectedIntent || !intents) {
      return;
    }

    const foundMaterial = trainingMaterial.find(item => item.id === value);
    setEditedTrainingMaterial(foundMaterial);

    const updatedIntent: Intent = {
      ...selectedIntent,
      trainingMaterials: {
        ...selectedIntent.trainingMaterials,
        [EditorUtils.objectKeyConversion(name)]: foundMaterial?.id
      }
    };

    if (accessToken && updatedIntent.id) {
      Api.getIntentsApi(accessToken).updateIntent({
        intentId: updatedIntent.id,
        intent: updatedIntent,
        storyId: storyId
      });
    }
    
    onSetStoryData({
      ...storyData,
      selectedIntent: updatedIntent,
      intents: intents.map(intent => (intent.id === updatedIntent.id ? updatedIntent : intent))
    });
    setDataChanged(true);
  };

  /**
   * Event handler for add training material click
   * 
   * @param name name of the training material type
   */
  const onAddTrainingMaterialClick = (name: any) => {
    const { selectedIntent } = storyData || {};

    if (!selectedIntent?.id) {
      return;
    }

    setEditingTrainingMaterial(true);
    setSelectedTrainingMaterialType(name as keyof object);
    setEditedTrainingMaterial({
      type: name,
      storyId: storyId,
      name: "",
      text: "",
      visibility: TrainingMaterialVisibility.STORY
    });
  };

  /**
   * Event handler for edit training material click
   */
  const onEditTrainingMaterialClick = () => {
    if (editedTrainingMaterial?.type) {
      setEditingTrainingMaterial(true);
      setSelectedTrainingMaterialType(editedTrainingMaterial.type);
    }
  };

  /**
   * Event handler for delete training material click
   */
  const onDeleteTrainingMaterialClick = () => {
    const { intents, selectedIntent } = storyData || {};

    if (!editedTrainingMaterial?.type || !selectedIntent || !intents) {
      return;
    }

    const key = EditorUtils.objectKeyConversion(editedTrainingMaterial.type);

    onSetStoryData({
      ...storyData,
      selectedIntent: { ...selectedIntent, trainingMaterials: { ...selectedIntent.trainingMaterials, [key]: undefined } },
      intents: intents.map(item => (item.id === selectedIntent.id ? selectedIntent : item))
    });
    setEditingTrainingMaterial(false);
    setEditedTrainingMaterial(undefined);
    setDataChanged(true);
  };

  /**
   * Updates training material
   */
  const updateTrainingMaterial = () => {
    const { intents, trainingMaterial, selectedIntent } = storyData || {};

    if (!editedTrainingMaterial?.type || !trainingMaterial || !selectedIntent?.id || !intents) {
      return;
    }
    const key = EditorUtils.objectKeyConversion(editedTrainingMaterial.type);
    const updatedIntent: Intent = {
      ...selectedIntent,
      trainingMaterials: {
        ...selectedIntent.trainingMaterials,
        [key]: editedTrainingMaterial.id
      }
    };
    onSetStoryData({
      ...storyData,
      trainingMaterial: trainingMaterial.map(item => (item.id === editedTrainingMaterial.id ? editedTrainingMaterial : item)),
      selectedIntent: updatedIntent,
      intents: intents.map(item => (item.id === updatedIntent.id ? updatedIntent : item))
    });
    setDataChanged(true);
  };

  /**
   * Creates training material
   */
  const createTrainingMaterial = () => {
    const { intents, trainingMaterial, selectedIntent } = storyData || {};

    if (!editedTrainingMaterial?.type || !trainingMaterial || !selectedIntent?.id || !intents) {
      return;
    }

    const key = EditorUtils.objectKeyConversion(editedTrainingMaterial.type);
    const updatedIntent: Intent = {
      ...selectedIntent,
      trainingMaterials: {
        ...selectedIntent.trainingMaterials,
        [key]: editedTrainingMaterial.id
      }
    };

    onSetStoryData({
      ...storyData,
      trainingMaterial: [ ...trainingMaterial, editedTrainingMaterial ],
      selectedIntent: updatedIntent,
      intents: intents.map(item => (item.id === updatedIntent.id ? updatedIntent : item))
    });
    setDataChanged(true);
  };

  /**
   * Event handler for save training material click
   * 
   * @param action action type: update / create
   */
  const onSaveTrainingMaterialClick = () => {
    if (!editedTrainingMaterial) {
      return;
    }

    editedTrainingMaterial.id ? updateTrainingMaterial() : createTrainingMaterial();
    setEditingTrainingMaterial(false);
    setSelectedTrainingMaterialType(null);
  };

  /**
   * Event handler for delete from list click
   * 
   * @param entity entity to be deleted
   */
  const onDeleteFromListClick = (entity: Knot | Intent) => {
    const intent = entity as Intent;
    const { sourceKnotId } = intent;

    if (!sourceKnotId) {
      return;
    }

    onSetStoryData({
      ...storyData,
      selectedIntent: intent,
      selectedKnot: undefined
    });

    setDeleteConfirmDialogOpen(true);
  };

  /**
   * Event handler for delete confirm click
   */
  const onDeleteConfirmClick = () => {
    const { intents, knots, selectedKnot, selectedIntent } = storyData || {};

    if (selectedIntent && intents) {
      setDeletedIntentRef(selectedIntent);
      setRemovedIntents([ ...removedIntents, selectedIntent ]);
      onSetStoryData({
        ...storyData,
        intents: intents.filter(intent => intent.id !== selectedIntent.id),
        selectedIntent: undefined
      });
    }

    if (selectedKnot && knots) {
      setDeletedKnotRef(selectedKnot);
      setRemovedKnots([ ...removedKnots, selectedKnot ]);
      onSetStoryData({
        ...storyData,
        knots: knots.filter(knot => knot.id !== selectedKnot.id),
        selectedKnot: undefined
      });
    }
    
    setDeleteConfirmDialogOpen(false);
  };

  /**
   * Event handler for updating knot info
   * 
   * @param event event from input change
   */
  const onUpdateKnotInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { knots, selectedKnot } = storyData || {};

    const { name, value } = event?.target;
    if (!knots || !selectedKnot?.id) {
      return;
    }

    const updatedKnot: Knot = {
      ...selectedKnot,
      [name]: value
    };

    onSetStoryData({
      ...storyData,
      knots: knots.map(item => (item.id === updatedKnot.id ? updatedKnot : item)),
      selectedKnot: updatedKnot
    });
    setDataChanged(true);
  };

  /**
   * Event handler for updating knot info
   * 
   * @param event event from input change
   */
  const onUpdateIntentInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { intents, selectedIntent } = storyData || {};
    const { name, value } = event?.target;

    if (!intents || !selectedIntent?.id) {
      return;
    }

    const updatedIntent: Intent = {
      ...selectedIntent,
      [name]: value
    };

    onSetStoryData({
      ...storyData,
      selectedIntent: updatedIntent,
      intents: intents.map(item => (item.id === updatedIntent.id ? updatedIntent : item))
    });
    setDataChanged(true);
  };

  /**
   * Event handler for updating story info
   * 
   * @param event event from input change
   */
  const onUpdateStoryInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { story } = storyData || {};
    const { name, value } = event?.target;

    if (!story) {
      return;
    }

    onSetStoryData({
      ...storyData,
      story: {
        ...story,
        [name]: value
      }
    });
  };

  /**
   * Event handler for update edited training material
   * 
   * @param event event of input change
   */
  const onUpdateEditedTrainingMaterial = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    if (!editedTrainingMaterial) {
      return;
    }

    setEditedTrainingMaterial({ ...editedTrainingMaterial, [name]: value });
    setDataChanged(true);
  };

  /**
   * Event handler for updating the content property of a knot
   * 
   * @param text text content
   * @param imageUrl image content
   * @param script script content
   */
  const onUpdateKnotContent = (text: string, imageUrl?: string, script?: string) => {
    const { selectedKnot } = storyData || {};

    if (!selectedKnot) {
      return;
    }

    let content = text;
    if (imageUrl) {
      content += `\n<img src="${imageUrl}"/>`;
    }
    if (script) {
      content += `\n<script>${script}</script>`;
    }

    onSetStoryData({
      ...storyData,
      selectedKnot: {
        ...selectedKnot,
        content: content
      }
    });
  };

  /**
   * Set the last edited story to cookie
   */
  const setLastEdited = () => {
    if (!storyData) {
      return;
    }

    const cookies = new Cookies();
    let recentStories: RecentStory[] = cookies.get("recentStories");
    const currentStory: RecentStory = {
      id: storyData.story?.id,
      name: storyData.story?.name,
      lastEditedTime: new Date().toLocaleString()
    };

    if (!currentStory.id) {
      return;
    }

    if (recentStories) {
      const idx = recentStories.findIndex(item => item.id === currentStory.id);

      // eslint-disable-next-line no-unused-expressions
      idx !== -1 && recentStories.splice(idx, 1);
      
      recentStories.unshift(currentStory);
      recentStories = recentStories.slice(0, 5);
      cookies.set("recentStories", recentStories, {
        secure: true,
        sameSite: true,
        maxAge: 60 * 60 * 24 * 30
      });
    } else {
      cookies.set("recentStories", [currentStory], {
        secure: true,
        sameSite: true,
        maxAge: 60 * 60 * 24 * 30
      });
    }
  };

  /**
   * Fetches knots list for the story
   */
  const fetchData = async () => {
    if (!accessToken || (!storyLoading && storyData?.story?.id === storyId)) {
      return;
    }

    onLoadStory();

    const [ foundStory, knotList, intentList, trainingMaterialList, scriptList ] = await Promise.all([
      Api.getStoriesApi(accessToken).findStory({ storyId: storyId }),
      Api.getKnotsApi(accessToken).listKnots({ storyId: storyId }),
      Api.getIntentsApi(accessToken).listIntents({ storyId: storyId }),
      Api.getTrainingMaterialApi(accessToken).listTrainingMaterials({ storyId: storyId }),
      Api.getScriptsApi(accessToken).listScripts()
    ]);

    onSetStoryData({
      story: foundStory,
      knots: knotList,
      intents: intentList,
      trainingMaterial: trainingMaterialList,
      scripts: scriptList
    });
  };

  /**
   * Renders loading
   */
  const renderLoading = () => {
    return (
      <Box className={ classes.loadingContainer }>
        <Loading text={ strings.loading.loadingStory }/>
      </Box>
    );
  };

  /**
   * Renders story tab of right toolbar
   */
  const renderStoryTab = () => {
    const { story } = storyData || {};

    return (
      <TextField
        label={ strings.editorScreen.rightBar.storyNameHelper }
        name="name"
        value={ story?.name }
        onChange={ onUpdateStoryInfo }
        onFocus={ () => setEditingEntityInfo(true) }
        onBlur={ () => setEditingEntityInfo(false) }
      />
    );
  };

  /**
   * Renders left toolbar
   */
  const renderLeftToolbar = () => {
    const { knots, intents } = storyData || {};

    if (!knots || !intents) {
      return null;
    }

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
            label={ strings.editorScreen.leftBar.storyLeftTab }
          />
          <Tab
            fullWidth
            value={ 1 }
            label={ strings.editorScreen.leftBar.knotsLeftTab }
          />
          <Tab
            fullWidth
            value={ 2 }
            label={ strings.editorScreen.leftBar.intentsLeftTab }
          />
        </Tabs>
        <Box>
          { leftToolBarIndex === 0 &&
            renderStoryTab()
          }
          { leftToolBarIndex === 1 &&
            <KnotPanel
              knots={ knots ?? [] }
              onKnotClick={ onKnotClick }
              onKnotSecondaryClick={ onDeleteFromListClick }
            />
          }
          { leftToolBarIndex === 2 &&
            <IntentPanel
              intents={ intents ?? [] }
              onIntentClick={ onIntentClick }
              onIntentSecondaryClick={ onDeleteFromListClick }
            />
          }
        </Box>
      </Drawer>
    );
  };

  /**
   * Renders toolbar action buttons
   */
  const renderActionButtons = () => {
    return (
      <>
        <div className={ classes.headerButtonsContainer }>
          <Button
            className={ classes.knotButton }
            variant="contained"
            onClick={ () => setAddingKnots(!addingKnots) }
          >
            <div className={ addingKnots ? classes.activeKnotButtonContainer : classes.inactiveKnotButtonContainer }>
              <Box width="100%" color="inherit">
                <KnotIcon htmlColor="inherit"/>
              </Box>
              <Box width="100%">
                { strings.editorScreen.add.knot }
              </Box>
            </div>
          </Button>
          <Button
            className={ classes.zoomButton }
            variant="contained"
            onClick={ () => setZoom100(true) }
          >
            <div className={ classes.zoomButtonContainer }>
              <Box width="100%" color="inherit">
                <FullscreenIcon htmlColor="inherit"/>
              </Box>
              <Box width="100%">
                100%
              </Box>
            </div>
          </Button>
        </div>

      </>
    );
  };

  /**
   * Renders main editor area
   */
  const renderEditorContent = () => {
    const { knots, intents } = storyData || {};

    if (!knots || !intents) {
      return null;
    }

    return (
      <Box
        marginLeft="320px"
        marginRight={ selectedEntitiesLength !== 0 ? "320px" : "0px" }
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
            centeredKnot={ centeredKnot }
            centeredIntent={ centeredIntent }
            zoom100={ zoom100 }
            setZoom100={ setZoom100 }
            deletedKnot={ deletedKnotRef }
            deletedIntent={ deletedIntentRef }
            onAddNode={ onAddNode }
            onMoveNode={ onMoveNode }
            onRemoveNode={ onRemoveNode }
            onAddLink={ onAddLink }
            onRemoveLink={ onRemoveLink }
            editingEntityInfo={ editingEntityInfo }
            onNodeSelectionChange={ onNodeSelectionChange }
            onLinkSelectionChange={ onLinkSelectionChange }
            onSelectedEntitiesAmountChange={ setSelectedEntitiesLength }
          />
        </Box>
      </Box>
    );
  };

  /**
   * Renders detailed tab of knot details
   */
  const renderKnotDetails = () => {
    const { selectedKnot, scripts, intents } = storyData || {};

    if (!selectedKnot) {
      return null;
    }

    return (
      <>
        <AccordionItem title={ strings.editorScreen.knots.discussion }>
          <DiscussionComponent
            selectedKnot={ selectedKnot }
            onUpdateKnotContent={ onUpdateKnotContent }
            scripts={ scripts }
            onFocus={ () => setEditingEntityInfo(true) }
            onBlur={ () => setEditingEntityInfo(false) }
          />
        </AccordionItem>
        <AccordionItem title={ strings.editorScreen.knots.linkedQuickResponses }>
          { intents && intents.filter(item => item.sourceKnotId === selectedKnot.id).map(item =>
            <QuickResponseButton
              editing={ editingQuickResponse }
              selectedIntent={ item }
              setEditingButtonFieldValue={ setEditingQuickResponse }
              onUpdateFieldInfo={ onUpdateIntentInfo }
              onFocus={ () => setEditingEntityInfo(true) }
              onBlur={ () => setEditingEntityInfo(false) }
            />)}
        </AccordionItem>
        <AccordionItem title={ strings.editorScreen.knots.advancedSettings }>
          <div className={ classes.accordionContent }>
            <TextField
              className={ classes.textField }
              label={ strings.editorScreen.knots.hintHelper }
              name="hint"
              placeholder={ strings.editorScreen.knots.hint }
              value={ selectedKnot.hint ?? "" }
              onChange={ onUpdateKnotInfo }
            />
            <TextField
              className={ classes.textField }
              label={ strings.editorScreen.rightBar.tokenizerHeader }
              name="tokenizer"
              select
              value={ selectedKnot.tokenizer ?? TokenizerType.WHITESPACE }
              onChange={ onUpdateKnotInfo }
            >
              { Object.values(TokenizerType).map(name =>
                <MenuItem key={ name } value={ name }>
                  { strings.editorScreen.rightBar.tokenizerType[name] }
                </MenuItem>)}
            </TextField>
          </div>
        </AccordionItem>
      </>
    );
  };

  /**
   * Renders special button
   */
  const renderSpecialButton = () => {
    const { selectedIntent } = storyData || {};

    return (
      <QuickResponseButton
        editing={ editingQuickResponse }
        selectedIntent={ selectedIntent }
        setEditingButtonFieldValue={ setEditingQuickResponse }
        onUpdateFieldInfo={ onUpdateIntentInfo }
        onFocus={ () => setEditingEntityInfo(true) }
        onBlur={ () => setEditingEntityInfo(false) }
      />
    );
  };

  /**
   * Renders training selection options content cards
   */
  const renderTrainingSelectionOptions = () => {
    const { trainingMaterial, selectedIntent } = storyData || {};

    return (
      <TrainingSelectionOptions
        selectedIntent={ selectedIntent }
        trainingMaterial={ trainingMaterial }
        onSetActiveTrainingMaterialChange={ onSetActiveTrainingMaterialChange }
        editingTrainingMaterial={ editingTrainingMaterial }
        onAddTrainingMaterialClick={ onAddTrainingMaterialClick }
        onEditTrainingMaterialClick={ onEditTrainingMaterialClick }
        selectedTrainingMaterialType={ selectedTrainingMaterialType }
        editedTrainingMaterial={ editedTrainingMaterial }
        onUpdateEditedTrainingMaterial={ onUpdateEditedTrainingMaterial }
        onDeleteTrainingMaterialClick={ onDeleteTrainingMaterialClick }
        onSaveTrainingMaterialClick={ onSaveTrainingMaterialClick }
        onFocus={ () => setEditingEntityInfo(true) }
        onBlur={ () => setEditingEntityInfo(false) }
      />
    );
  };

  /**
   * Renders detailed tab of intent details
   * 
   * @param currentKnot current intent
   */
  const renderIntentDetails = () => {
    const { selectedIntent } = storyData || {};

    if (!selectedIntent) {
      return null;
    }

    const intentTypes: string[] = Object.values(IntentType);

    return (
      <>
        <TextField
          label={ strings.editorScreen.rightBar.intentTypeHelper }
          name="type"
          select
          defaultValue={ selectedIntent.type }
          onChange={ onUpdateIntentInfo }
          onFocus={ () => setEditingEntityInfo(true) }
          onBlur={ () => setEditingEntityInfo(false) }
        >
          { intentTypes.map(name =>
            <MenuItem key={ name } value={ name }>
              { strings.editorScreen.rightBar.intentType[name as keyof object] }
            </MenuItem>)}
        </TextField>
        <Divider className={ classes.divider }/>
        <InputLabel className={ classes.buttonLabel }>
          { strings.editorScreen.rightBar.quickResponsesHelper }
        </InputLabel>
        { renderSpecialButton() }
        <Divider className={ classes.divider }/>
        <Box>
          <AccordionItem title={ strings.editorScreen.rightBar.trainingMaterialsHeader }>
            { renderTrainingSelectionOptions() }
          </AccordionItem>
        </Box>
        <Divider className={ classes.divider }/>
      </>
    );
  };

  /**
   * Renders knot or intent
   */
  const renderKnotOrIntent = () => {
    const { selectedKnot, selectedIntent } = storyData || {};

    if (selectedKnot) {
      return renderKnotDetails();
    } if (selectedIntent) {
      renderIntentDetails();
    }

    return null;
  };

  /**
   * Renders details tab if an entity is selected  
   */
  const renderDetailsTab = () => {
    const { selectedKnot, selectedIntent } = storyData || {};

    return (
      <Box>
        { selectedKnot &&
          <TextField
            label={ strings.editorScreen.rightBar.knotNameHelper }
            name="name"
            value={ selectedKnot.name ?? "" }
            onFocus={ () => setEditingEntityInfo(true) }
            onBlur={ () => setEditingEntityInfo(false) }
            onChange={ onUpdateKnotInfo }
          />
        }
        { selectedIntent &&
          <TextField
            label={ strings.editorScreen.rightBar.intentNameHelper }
            name="name"
            defaultValue={ selectedIntent.name ?? "" }
            onChange={ (e: any) => onUpdateIntentInfo(e) }
            onFocus={ () => setEditingEntityInfo(true) }
            onBlur={ () => setEditingEntityInfo(false) }
          />
        }
        <Divider className={ classes.divider }/>
        { renderKnotOrIntent() }
      </Box>
    );
  };

  /**
   * Renders right toolbar linking tab
   */
  const renderLinkingTab = () => {
    const { intents, knots, selectedKnot } = storyData || {};

    if (!selectedKnot || !knots || !intents) {
      return null;
    }

    return (
      <KnotLinking
        selectedKnot={ selectedKnot }
        knots={ knots }
        intents={ intents }
        onAddLink={ onAddLink }
      />
    );
  };

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
            label={ strings.editorScreen.rightBar.detailsRightTab }
          />
          <Tab
            value={ 1 }
            label={ strings.editorScreen.rightBar.linkingRightTab }
          />
        </Tabs>
        <Box p={ 2 }>
          { rightToolBarIndex === 0 && renderDetailsTab() }
          { rightToolBarIndex === 1 && renderLinkingTab() }
        </Box>
      </Drawer>
    );
  };

  /**
   * Renders delete confirm dialog
   */
  const renderDeleteConfirmDialog = () => {
    const { selectedKnot, selectedIntent } = storyData || {};

    return (
      <GenericDialog
        title={ strings.editorScreen.confirm.title }
        positiveButtonText={ strings.generic.remove }
        cancelButtonText={ strings.generic.cancel }
        onClose={ () => setDeleteConfirmDialogOpen(false) }
        onCancel={ () => setDeleteConfirmDialogOpen(false) }
        onConfirm={ onDeleteConfirmClick }
        open={ deleteConfirmDialogOpen }
        error={ false }
      >
        { (selectedKnot || selectedIntent) &&
          <Typography variant="h4">
            { selectedIntent ? strings.editorScreen.confirm.intent : strings.editorScreen.confirm.knot }
          </Typography>
        }
      </GenericDialog>
    );
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setLastEdited();
    // eslint-disable-next-line
  }, [ storyData ]);

  if (!keycloak) {
    return null;
  }

  if (storyLoading || !storyData) {
    return (
      <AppLayout
        keycloak={ keycloak }
        pageTitle={ strings.loading.loading }
        storySelected={ true }
      >
        { renderLoading() }
      </AppLayout>
    );
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
      { renderDeleteConfirmDialog() }
    </AppLayout>
  );
};

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 * @returns state from props
 */
const mapStateToProps = (state: ReduxState) => ({
  accessToken: state.auth.accessToken,
  keycloak: state.auth.keycloak,
  storyData: state.story.storyData,
  storyLoading: state.story.storyLoading
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({
  onLoadStory: () => dispatch(loadStory()),
  onSetStoryData: (storyData: StoryData) => dispatch(setStoryData(storyData))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScreen);