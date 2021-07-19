import { Box, Drawer, Tab, Tabs, TextField, Button, MenuItem, InputLabel, Snackbar, Dialog, CircularProgress } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { TokenizerType, KnotType, Story, Knot, Intent, IntentType, TrainingMaterial, TrainingMaterialType, TrainingMaterialVisibility, Script, KnotScope } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import IntentPanel from "../../intent-components/intent-list/intent-list";
import KnotPanel from "../../knot-components/knot-list/knot-list";
import StoryEditorView from "../../views/story-editor-view";
import { CustomNodeModel } from "../../diagram-components/custom-node/custom-node-model";
import { useEditorScreenStyles } from "./editor-screen.styles";
import { useParams } from "react-router-dom";
import CustomLinkModel from "../../diagram-components/custom-link/custom-link-model";
import AccordionItem from "../../generic/accordion-item";
import TrainingSelectionOptions from "../../intent-components/training-selection-options/training-selection-options";
import QuickResponseButton from "../../intent-components/quick-response-button/quick-response-button";
import EditorUtils from "../../../utils/editor";
import { StoryData } from "../../../types"
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
  loadStory: () => void;
  setStoryData: (storyData: StoryData) => void;
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
  loadStory,
  setStoryData,
}) => {
  const { storyId } = useParams<{ storyId: string }>();
  const classes = useEditorScreenStyles();
  const [ centeredKnot, setCenteredKnot ] = React.useState<Knot | undefined>(undefined);
  const [ centeredIntent, setCenteredIntent ] = React.useState<Intent | undefined>(undefined);
  const [ leftToolBarIndex, setLeftToolBarIndex ] = React.useState(0);
  const [ rightToolBarIndex, setRightToolBarIndex ] = React.useState(0);
  const [ addingKnots, setAddingKnots ] = React.useState(false);
  const [ dataChanged, setDataChanged ] = React.useState(false);
  const [ editingEntityInfo, setEditingEntityInfo ] = React.useState(false);
  const [ editingQuickResponse, setEditingQuickResponse ] = React.useState(false);
  const [ editingTrainingMaterial, setEditingTrainingMaterial ] = React.useState(false);
  const [ selectedTrainingMaterialType, setSelectedTrainingMaterialType ] = React.useState<TrainingMaterialType | null>(null);
  const [ editedTrainingMaterial, setEditedTrainingMaterial ] = React.useState<TrainingMaterial>();
  const [ removedKnots, setRemovedKnots ] = React.useState<Knot[]>([]);
  const [ removedIntents, setRemovedIntents ] = React.useState<Intent[]>([]);
  const [ alertMessage, setAlertMessage ] = React.useState("");
  const [ alertType, setAlertType ] = React.useState<"error" | "success">("success");
  const [ alertOpen, setAlertOpen ] = React.useState(false);
  const [ selectedEntititiesLength, setSelectedEntitiesLength ] = React.useState(0);

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

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
    setStoryData({ ...storyData, selectedKnot: knot, selectedIntent: undefined });
  }

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
    setStoryData({ ...storyData, selectedIntent: intent, selectedKnot: undefined });
  }

  /**
   * Event handler for on intent click
   * 
   * @param event Synthetic event
   * @param reason Reason of closing the alert
   */
  const handleAlertClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

  /**
   * Event handler for add node
   *
   * @param node added node
   */
  const onAddNode = (node: CustomNodeModel) => {
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
    }

    setStoryData({
      ...storyData,
      knots: [ ...knots, createdKnot ]
    });
    setDataChanged(true);
  }

  /**
   * Event handler for node move
   *
   * @param movedNode moved node
   * @param knot knot that needs update
   */
  const onMoveNode = (knotId: string, node: CustomNodeModel) => {
    if (!knots) {
      return;
    }

    const updatedKnot: Knot = {
      ...knots.find(knot => knot.id === knotId)!,
      coordinates: node.getPosition()
    }

    setStoryData({
      ...storyData,
      selectedKnot: updatedKnot,
      selectedIntent: undefined,
      knots: knots.map(item => item.id === updatedKnot.id ? updatedKnot : item)
    });

    setDataChanged(true);
  }

  /**
   * Event handler for remove node
   *
   * @param removedNodeId Removed node id (knot ID)
   */
  const onRemoveNode = (removedNodeId: string) => {
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
    setStoryData({
      ...storyData,
      knots: knots.filter(item => item.id !== removedNodeId)
    });
    setDataChanged(true);
  }

  /**
   * Event handler for add link
   *
   * @param sourceNodeId link (intent) source node (knot) id
   * @param targetNodeId link (intent) target node (knot) id
   */
  const onAddLink = (sourceNodeId: string, targetNodeId: string) => {
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
    }

    setStoryData({
      ...storyData,
      intents: [ ...intents, createdIntent ],
      selectedIntent: createdIntent,
      selectedKnot: undefined
    });
    setDataChanged(true);
  }

  /**
   * Event handler for remove link
   *
   * @param linkId removed link (intent) id
   */
  const onRemoveLink = (linkId: string) => {
    if (!intents) {
      return;
    }

    const intent = intents.find(item => item.id === linkId);
    if (intent) {
      setRemovedIntents([ ...removedIntents, intent ])
    }

    setStoryData({
      ...storyData,
      intents: intents.filter(item => item.id !== linkId)
    });
    setDataChanged(true);
  }

  /**
   * Event handler for node selection change
   * 
   * @param node node
   */
  const onNodeSelectionChange = (node: CustomNodeModel) => {
    if (!knots) {
      return;
    }

    if (selectedEntititiesLength !== 0) {
      setStoryData({
        ...storyData,
        selectedIntent: undefined,
        selectedKnot: undefined
      });
      return;
    }

    const knot = knots.find(item => item.id === node.getID());

    setStoryData({
      ...storyData,
      selectedIntent: undefined,
      selectedKnot: knot
    });
    if (knot?.scope && (knot?.scope === KnotScope.Home || knot?.scope === KnotScope.Global)) {
      setEditingEntityInfo(true);
    } else {
      setEditingEntityInfo(false);
    }
  }

  /**
   * Event handler for link selection change
   * 
   * @param link link
   */
  const onLinkSelectionChange = (link: CustomLinkModel) => {
    if (!intents) {
      return;
    }

    if (selectedEntititiesLength !== 0) {
      setStoryData({
        ...storyData,
        selectedIntent: undefined,
        selectedKnot: undefined
      });
      return;
    }

    const intent = intents.find(item => item.id === link.getID());

    setStoryData({
      ...storyData,
      selectedIntent: intent,
      selectedKnot: undefined
    });
  }

  /**
   * Event handler for set active training material change 
   * 
   * @param event event from input change
   */
  const onSetActiveTrainingMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        storyId
      });
    }    
    
    setStoryData({
      ...storyData,
      selectedIntent: updatedIntent,
      intents: intents.map(intent => intent.id === updatedIntent.id ? updatedIntent : intent)
    });
    setDataChanged(true);
  }

  /**
   * Event handler for add training material click
   * 
   * @param name name of the training material type
   */
  const onAddTrainingMaterialClick = (name: any) => {
    if (!selectedIntent?.id) {
      return;
    }

    setEditingTrainingMaterial(true);
    setSelectedTrainingMaterialType(name as keyof object);
    setEditedTrainingMaterial({
      type: name,
      storyId,
      name: "",
      text: "",
      visibility: TrainingMaterialVisibility.STORY
    });
  }

  /**
   * Event handler for edit training material click
   */
  const onEditTrainingMaterialClick = () => {
    if (editedTrainingMaterial?.type) {
      setEditingTrainingMaterial(true);
      setSelectedTrainingMaterialType(editedTrainingMaterial.type);
    }
  }

  /**
   * Event handler for delete training material click
   */
  const onDeleteTrainingMaterialClick = () => {
    if (!editedTrainingMaterial?.type || !selectedIntent || !intents) {
      return;
    }

    const key = EditorUtils.objectKeyConversion(editedTrainingMaterial.type);

    setStoryData({
      ...storyData,
      selectedIntent: { ...selectedIntent, trainingMaterials: { ...selectedIntent.trainingMaterials, [key]: undefined } },
      intents: intents.map(item => item.id === selectedIntent.id ? selectedIntent : item)
    });
    setEditingTrainingMaterial(false);
    setEditedTrainingMaterial(undefined);
    setDataChanged(true);
  }

  /**
   * Event handler for save training material click
   * 
   * @param action action type: update / create
   */
  const onSaveTrainingMaterialClick = () => {
    if(!editedTrainingMaterial) {
      return;
    }

    editedTrainingMaterial.id ? updateTrainingMaterial() : createTrainingMaterial();
    setEditingTrainingMaterial(false);
    setSelectedTrainingMaterialType(null);
  }

  /**
   * Updates training material
   */
  const updateTrainingMaterial = () => {
    if (!editedTrainingMaterial?.type || !trainingMaterial || !selectedIntent?.id || !intents) {
      return;
    }
    const key = EditorUtils.objectKeyConversion(editedTrainingMaterial.type);
    const updatedIntent: Intent = {
        ...selectedIntent,
        trainingMaterials: { 
          ...selectedIntent.trainingMaterials,
          [key]: editedTrainingMaterial.id
        }
    }
    setStoryData({
      ...storyData,
      trainingMaterial: trainingMaterial.map(item => item.id === editedTrainingMaterial.id ? editedTrainingMaterial : item),
      selectedIntent: updatedIntent,
      intents: intents.map(item => item.id === updatedIntent.id ? updatedIntent : item)
    });
    setDataChanged(true);
  }

  /**
   * Creates training material
   */
  const createTrainingMaterial = () => {
    if (!editedTrainingMaterial?.type || !trainingMaterial || !selectedIntent?.id || !intents) {
      return;
    }

    const key = EditorUtils.objectKeyConversion(editedTrainingMaterial.type);
    const updatedIntent: Intent = {
      ...selectedIntent,
      trainingMaterials: {
        ...selectedIntent.trainingMaterials,
        [key]: editedTrainingMaterial.id
      }
    }

    setStoryData({
      ...storyData,
      trainingMaterial: [ ...trainingMaterial, editedTrainingMaterial ],
      selectedIntent: updatedIntent,
      intents: intents.map(item => item.id === updatedIntent.id ? updatedIntent : item)
    });
    setDataChanged(true);
  }

  /**
   * Event handler for updating knot info
   * 
   * @param event event from input change
   */
  const onUpdateKnotInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    if (!knots || !selectedKnot?.id) {
      return;
    }

    const updatedKnot: Knot = {
      ...selectedKnot,
      [name]: value
    }

    setStoryData({
      ...storyData,
      knots: knots.map(item => item.id === updatedKnot.id ? updatedKnot : item),
      selectedKnot: updatedKnot
    });
    setDataChanged(true);
  }

  /**
   * Event handler for updating knot info
   * 
   * @param event event from input change
   */
  const onUpdateIntentInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    if (!intents || !selectedIntent?.id) {
      return;
    }

    const updatedIntent: Intent = {
      ...selectedIntent,
      [name]: value
    }

    setStoryData({
      ...storyData,
      selectedIntent: updatedIntent,
      intents: intents.map(item => item.id === updatedIntent.id ? updatedIntent : item)
    });
    setDataChanged(true);
  }

  /**
   * Event handler for updating story info
   * 
   * @param event event from input change
   */
  const onUpdateStoryInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    if(!story) {
      return;
    }

    setStoryData({
      ...storyData,
      story: {
        ...story,
        [name]: value
      }
    })
  }

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
  }

  /**
   * Event handler for save button click
   */
  const onSaveClick = async () => {
    if (!accessToken || !storyData!.story) {
      return;
    }

    try {
      const knotsApi = Api.getKnotsApi(accessToken);
      const intentsApi = Api.getIntentsApi(accessToken);
      const trainingMaterialsApi = Api.getTrainingMaterialApi(accessToken);
      const storyApi = Api.getStoriesApi(accessToken);

      const storyPromise = story? storyApi.updateStory({ storyId: storyId, story: story }) : undefined;
      
      const knotUpdatePromises = (knots || []).map(
        knot => (
          knot.id? knotsApi.updateKnot({
            storyId: storyId,
            knotId: knot.id,
            knot: knot
          }) : knotsApi.createKnot({
            storyId: storyId,
            knot: knot
          })
        )
      );

      const knotDeletePromises = removedKnots.map(
        knot => (
          knotsApi.deleteKnot({
            storyId: storyId,
            knotId: knot.id!!
          })
        )
      );

      const intentUpdatePromises = (intents || []).map(
        intent => (
          intent.id? intentsApi.updateIntent({
            storyId: storyId,
            intentId: intent.id,
            intent: intent
          }) : intentsApi.createIntent({
            storyId: storyId,
            intent: intent
          })
        )
      );

      const intentDeletePromises = removedIntents.map(
        intent => (
          intentsApi.deleteIntent({
            storyId: storyId,
            intentId: intent.id!!
          })
        )
      );

      const trainingMaterialUpdatePromises = (trainingMaterial || []).map(
        material => (
          material.id? trainingMaterialsApi.updateTrainingMaterial({
            trainingMaterialId: material.id,
            trainingMaterial: material
          }) : trainingMaterialsApi.createTrainingMaterial({
            trainingMaterial: material
          })
        )
      )

      console.log("TODO Loading, prevent user from interacting");

      const [ updatedStory, updatedKnots, updatedIntents, updatedMaterials ] = await Promise.all([ 
        storyPromise, 
        Promise.all(knotDeletePromises)
          .then(() => Promise.all(knotUpdatePromises)),
        Promise.all(intentDeletePromises)
          .then(() => Promise.all(intentUpdatePromises)),
        Promise.all(trainingMaterialUpdatePromises)
      ])
      
      setStoryData({
        story: updatedStory!!,
        knots: updatedKnots,
        intents: updatedIntents,
        trainingMaterial: updatedMaterials
      });

      setRemovedKnots([]);
      setRemovedIntents([]);
    } catch (error) {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage(strings.editorScreen.save.fail);
      console.error(error);
    }
    setAlertOpen(true);
    setAlertType("success");
    setAlertMessage(strings.editorScreen.save.success);
    setDataChanged(false);
  }

  /**
   * Event handler for updating the content property of a knot
   * 
   * @param text text content
   * @param imageUrl image content
   * @param script script content
   */
  const onUpdateKnotContent = (text: string, imageUrl?: string, script?: string) => {
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

    setStoryData({
      ...storyData,
      selectedKnot: {
        ...selectedKnot,
        content: content
      }
    })
  }

  /**
   * Fetches knots list for the story
   */
  const fetchData = async () => {
    if (!accessToken) {
      return;
    }

    if (!storyLoading && storyData && storyData.story?.id === storyId){
      return;
    }

    loadStory();

    const [ story, knotList, intentList, trainingMaterialList, scriptList ] = await Promise.all([
      Api.getStoriesApi(accessToken).findStory({ storyId }),
      Api.getKnotsApi(accessToken).listKnots({ storyId }),
      Api.getIntentsApi(accessToken).listIntents({ storyId }),
      Api.getTrainingMaterialApi(accessToken).listTrainingMaterials({ storyId }),
      Api.getScriptsApi(accessToken).listScripts()
    ]);

    setStoryData({
      story: story,
      knots: knotList,
      intents: intentList,
      trainingMaterial: trainingMaterialList,
      scripts: scriptList
    });
  }

  /**
   * Render alert message
   */
  const renderAlert = () => {
    return (
      <Snackbar 
        open={ alertOpen } 
        autoHideDuration={ 6000 } 
        onClose={ handleAlertClose }
      >
        <MuiAlert 
          onClose={ handleAlertClose } 
          severity={ alertType }
          elevation={ 6 } 
          variant="filled"
        >
        { alertMessage }
        </MuiAlert>
      </Snackbar>
    );
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
            />
          }
          { leftToolBarIndex === 2 &&
            <IntentPanel
              intents={ intents ?? [] }
              onIntentClick={ onIntentClick }
            />
          }
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
        marginRight={ selectedEntititiesLength !== 0 ? "320px" : "0px" }
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
            onAddNode={ onAddNode }
            onMoveNode={ onMoveNode }
            onRemoveNode={ onRemoveNode }
            onAddLink={ onAddLink }
            onRemoveLink={ onRemoveLink }
            editingEntityInfo={ editingEntityInfo }
            onNodeSelectionChange={ onNodeSelectionChange }
            onLinkSelectionChange={ onLinkSelectionChange }
            onSelectedEntitiesAmountChange = { setSelectedEntitiesLength }
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
        className= { classes.knotButton }
        variant="contained"
        onClick={ () => setAddingKnots(!addingKnots) }
      > 
        <div className={ addingKnots ? classes.activeKnotButtonContainer : classes.inactiveKnotButtonContainer }>
          <Box width="100%" color="inherit">
            <KnotIcon htmlColor={ "inherit" }/>
          </Box>
          <Box width="100%">
            { strings.editorScreen.add.knot }
          </Box>
        </div>
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
  }

  /**
   * Renders story tab of right toolbar
   */
  const renderStoryTab = () => {
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
  }

  /**
   * Renders details tab if an entity is selected  
   */
  const renderDetailsTab = () => {
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
        { 
          selectedKnot ?
            renderKnotDetails() :
            selectedIntent ?
              renderIntentDetails() :
              null
        }
      </Box>
    )
  }

  /**
   * Renders detailed tab of knot details
   */
  const renderKnotDetails = () => {
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
            />
          )}
        </AccordionItem>
        <AccordionItem title={ strings.editorScreen.knots.advancedSettings }>
          <div className={ classes.accordionContent }>
            <TextField
              className={ classes.textField }
              label={ strings.editorScreen.knots.hintHelper }
              name={ "hint" }
              placeholder={ strings.editorScreen.knots.hint }
              value={ selectedKnot.hint ?? "" }
              onChange={ onUpdateKnotInfo }
            />
            <TextField
              className={ classes.textField }
              label={ strings.editorScreen.rightBar.tokenizerHeader }
              name={ "tokenizer" }
              select
              value={ selectedKnot.tokenizer ?? TokenizerType.WHITESPACE }
              onChange={ onUpdateKnotInfo }
            >
              { Object.values(TokenizerType).map(name =>
                <MenuItem key={ name } value={ name }>
                  { strings.editorScreen.rightBar.tokenizerType[name] }
                </MenuItem>
              )}
            </TextField>
          </div>
        </AccordionItem>
      </>
    );
  }

  /**
   * Renders detailed tab of intent details
   * 
   * @param currentKnot current intent
   */
  const renderIntentDetails = () => {
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
            </MenuItem>
          )}
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
  }

  /**
   * Renders special button
   */
  const renderSpecialButton = () => {
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
  }

  /**
   * Renders training selection options content cards
   */
  const renderTrainingSelectionOptions = () => {
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

  /**
   * Renders loading
   */
  const renderLoading = () => {
    return (
      <AppLayout
        keycloak={ keycloak }
        pageTitle={ "Loading" }
      >
        <Box style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", display: "flex" }}>
          <Loading text={ strings.loading.loadingStory }/>
        </Box>
      </AppLayout>
    );
  }

  if (storyLoading || !storyData) {
    return renderLoading();
  }

  const { story, knots, selectedKnot, selectedIntent, intents, trainingMaterial, scripts } = storyData;

  return (
    <>
      <AppLayout
        storySelected
        keycloak={ keycloak }
        storyId={ storyData.story?.id }
        pageTitle={ storyData.story?.name ?? "" }
        dataChanged={ dataChanged }
        onSaveClick={ onSaveClick }
      >
        { renderLeftToolbar() }
        { renderEditorContent() }
        { selectedEntititiesLength !== 0 && renderRightToolbar() }
      </AppLayout>
      { renderAlert() }
    </>
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
  loadStory: () => dispatch(loadStory()),
  setStoryData: (storyData: StoryData) => dispatch(setStoryData(storyData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScreen);
