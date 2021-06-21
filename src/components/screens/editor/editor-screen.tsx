import { Box, Drawer, Tab, Tabs, TextField, Button, MenuItem, InputLabel } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { TokenizerType, KnotType, Story, Knot, Intent, IntentType, TrainingMaterial, TrainingMaterialType, TrainingMaterialVisibility, IntentTrainingMaterials } from "../../../generated/client/models";
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
  selectedIntent? : Intent;
  trainingMaterial?: TrainingMaterial[];
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
  const { story, knots, selectedKnot, selectedIntent, intents, trainingMaterial } = storyData;
  const [ leftToolBarIndex, setLeftToolBarIndex ] = React.useState(0);
  const [ rightToolBarIndex, setRightToolBarIndex ] = React.useState(0);
  const [ addingKnots, setAddingKnots ] = React.useState(false);
  const [ dataChanged, setDataChanged ] = React.useState(false);
  const [ editingQuickResponse, setEditingQuickResponse ] = React.useState(false);
  const [ editingTrainingMaterial, setEditingTrainingMaterial ] = React.useState(false);
  const [ selectedTrainingMaterialType, setSelectedTrainingMaterialType ] = React.useState<TrainingMaterialType | null>(null);
  const [ editedTrainingMaterial, setEditedTrainingMaterial ] = React.useState<TrainingMaterial | undefined>(undefined);


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
   * Event handler for node selection change
   * 
   * @param node node
   */
  const onNodeSelectionChange = async (node: CustomNodeModel) => {
    if (!accessToken || !intents) {
      return;
    }

    const knot = await Api.getKnotsApi(accessToken).findKnot({
      storyId: storyId,
      knotId: node.getID()
    });

    setStoryData({
      ...storyData,
      selectedIntent: undefined,
      selectedKnot: knot
    });
  }

  /**
   * Event handler for link selection change
   * 
   * @param link link
   */
  const onLinkSelectionChange = async (link: CustomLinkModel) => {
    if (!accessToken || !intents) {
      return;
    }

    const intent = await Api.getIntentsApi(accessToken).findIntent({
      storyId: storyId,
      intentId: link.getID()
    });

    setStoryData({
      ...storyData,
      selectedIntent: intent,
      selectedKnot: undefined
    });
  }

  /**
   * Event handler for set active training material change 
   * 
   * @param event event
   */
  const onSetActiveTrainingMaterialChange = (event: any) => {
    const { name, value } = event.target;
    if (!name || !value || !trainingMaterial || !selectedIntent || !intents) {
      return;
    }
    let foundMaterial: TrainingMaterial | undefined;
    if (value === "none") {
      setEditedTrainingMaterial(undefined);
    } else {
      foundMaterial = trainingMaterial.find(item => item.id === value);
      foundMaterial && setEditedTrainingMaterial(foundMaterial);
    }
    const key = objectKeyConversion(name);
    selectedIntent.trainingMaterials = { ...selectedIntent.trainingMaterials, [key]: foundMaterial?.id ?? undefined };

    if (accessToken && selectedIntent.id) {
      Api.getIntentsApi(accessToken).updateIntent({
        intentId: selectedIntent.id,
        intent: selectedIntent,
        storyId: storyId
      });
    }
    
    
    setStoryData({
      ...storyData,
      selectedIntent: selectedIntent,
      intents: [ ...intents.filter(item => item.id !== selectedIntent.id), selectedIntent ]
    });
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
      storyId: storyId,
      name: "",
      text: "",
      visibility: TrainingMaterialVisibility.STORY
    });
  }

  /**
   * Event handler for edit training material click
   */
  const onEditTrainingMaterialClick = () => {
    if (!editedTrainingMaterial?.type) {
      return;
    }
    setEditingTrainingMaterial(true);
    setSelectedTrainingMaterialType(editedTrainingMaterial.type);
  }

  /**
   * Event handler for delete training material click
   */
  const onDeleteTrainingMaterialClick = () => {
    if (!editedTrainingMaterial?.type || !selectedIntent || !intents) {
      return;
    }

    const key = objectKeyConversion(editedTrainingMaterial.type);

    setStoryData({
      ...storyData,
      selectedIntent: { ...selectedIntent, trainingMaterials: { ...selectedIntent.trainingMaterials, [key]: undefined } },
      intents: intents.map(item => item.id === selectedIntent.id ? selectedIntent : item)
    });
    setEditingTrainingMaterial(false);
    setEditedTrainingMaterial(undefined);
  }

  /**
   * Event handler for save training material click
   * 
   * @param action action type: update / create
   */
  const onSaveTrainingMaterialClick = async (action: string) => {
    let updatedTrainingMaterial: TrainingMaterial;
    let updatedIntent: Intent;
    if (!accessToken || !editedTrainingMaterial?.type || !trainingMaterial || !selectedIntent?.id || !intents) {
      return;
    }
    const key = objectKeyConversion(editedTrainingMaterial.type);

    if (action === "update" && editedTrainingMaterial.id) {
      try {
        updatedTrainingMaterial = await Api.getTrainingMaterialApi(accessToken).updateTrainingMaterial({
          trainingMaterialId: editedTrainingMaterial.id,
          trainingMaterial: editedTrainingMaterial
        });
        updatedIntent = await Api.getIntentsApi(accessToken).updateIntent({
          intentId: selectedIntent.id,
          intent: { ...selectedIntent, trainingMaterials: { 
              ...selectedIntent.trainingMaterials,
              [key]: editedTrainingMaterial.id
            }
          },
          storyId: storyId
        });
      } catch (error) {
        throw error;
      }
      setStoryData({
        ...storyData,
        trainingMaterial: trainingMaterial.map(item => item.id === updatedTrainingMaterial.id ? updatedTrainingMaterial : item),
        selectedIntent: updatedIntent,
        intents: intents.map(item => item.id === updatedIntent.id ? updatedIntent : item)
      });
    }
    if (action === "create") {
      try {
        updatedTrainingMaterial = await Api.getTrainingMaterialApi(accessToken).createTrainingMaterial({
          trainingMaterial: editedTrainingMaterial
        });
        updatedIntent = await Api.getIntentsApi(accessToken).updateIntent({
          intentId: selectedIntent.id,
          intent: { ...selectedIntent, trainingMaterials: {
              ...selectedIntent.trainingMaterials,
              [key]: editedTrainingMaterial.id
            }
          },
          storyId: storyId
        });
      } catch (error) {
        throw error;
      }
      setStoryData({
        ...storyData,
        trainingMaterial: [ ...trainingMaterial, updatedTrainingMaterial ],
        selectedIntent: updatedIntent,
        intents: intents.map(item => item.id === updatedIntent.id ? updatedIntent : item)
      });
    }
    setEditingTrainingMaterial(false);
    setSelectedTrainingMaterialType(null);
  }

  /**
   * Event handler for updating knot info
   * 
   * @param knot knot with updated info
   */
  const onUpdateKnotInfo = async (event: React.ChangeEvent<any>, knot: Knot) => {
    let { name, value } = event?.target;
    if (!accessToken || !knots || !knot?.id) {
      return;
    }

    const updatedKnot = await Api.getKnotsApi(accessToken).updateKnot({
      storyId: storyId,
      knotId: knot.id,
      knot: { ...knot, [name]: value }
    });

    setStoryData({
      ...storyData,
      knots: knots.map(item => item.id === updatedKnot.id ? updatedKnot : item)
    });
  }

  /**
   * Event handler for updating knot info
   * 
   * @param knot knot with updated info
   */
  const onUpdateIntentInfo = async (event: React.ChangeEvent<any>) => {
    const { name, value } = event?.target;
    if (!accessToken || !intents || !selectedIntent?.id) {
      return;
    }

    const updatedIntent = await Api.getIntentsApi(accessToken).updateIntent({
      storyId: storyId,
      intentId: selectedIntent.id,
      intent: { ...selectedIntent, [name]: value }
    });

    setStoryData({
      ...storyData,
      selectedIntent: updatedIntent,
      intents: intents.map(item => item.id === updatedIntent.id ? updatedIntent : item)
    });
  }

  /**
   * Event handler for update edited training material
   */
  const onUpdateEditedTrainingMaterial = (event: React.ChangeEvent<any>) => {
    const { name, value } = event?.target;
    if (!editedTrainingMaterial) {
      return;
    }

    setEditedTrainingMaterial({ ...editedTrainingMaterial, [name]: value });
  }

  /**
   * Converts a training material type into intent training material key
   * 
   * @param name training material type key or value
   * @returns object key
   */
  const objectKeyConversion = (name: string): keyof IntentTrainingMaterials => ({
    [TrainingMaterialType.INTENTOPENNLPDOCCAT]: "intentOpenNlpDoccatId",
    [TrainingMaterialType.INTENTREGEX]: "intentRegexId",
    [TrainingMaterialType.VARIABLEOPENNLPNER]: "variableOpenNlpNerId",
    [TrainingMaterialType.VARIABLEOPENNLPREGEX]: "variableOpenNlpRegex",
  })[name] ?? "intentOpenNlpDoccatId";

  /**
   * Fetches knots list for the story
   */
  const fetchData = async () => {
    if (!accessToken) {
      return;
    }

    const [ story, knotList, intentList, trainingMaterialList ] = await Promise.all([
      Api.getStoriesApi(accessToken).findStory({ storyId }),
      Api.getKnotsApi(accessToken).listKnots({ storyId }),
      Api.getIntentsApi(accessToken).listIntents({ storyId }),
      Api.getTrainingMaterialApi(accessToken).listTrainingMaterials({ storyId })
    ]);

    setStoryData({
      story: story,
      knots: knotList,
      intents: intentList,
      trainingMaterial: trainingMaterialList
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
          { leftToolBarIndex === 0 && renderStoryTab() }
          { leftToolBarIndex === 1 && <KnotPanel knots={ knots ?? [] }/> }
          { leftToolBarIndex === 2 && <IntentPanel intents={ intents ?? [] }/> }
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
            onNodeSelectionChange={ onNodeSelectionChange }
            onLinkSelectionChange={ onLinkSelectionChange }
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
        defaultValue={ story?.name }
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
            defaultValue={ selectedKnot.name ?? "" }
            onChange={ (e: any) => onUpdateKnotInfo(e, selectedKnot) }
          />
        }
        { selectedIntent &&
          <TextField
            label={ strings.editorScreen.rightBar.intentNameHelper }
            name="name"
            defaultValue={ selectedIntent.name ?? "" }
            onChange={ (e: any) => onUpdateIntentInfo(e) }
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
   * 
   * @param currentKnot current knot
   */
  const renderKnotDetails = () => {
    return null;
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
          onChange={ (e: any) => onUpdateIntentInfo(e) }
        >
          { intentTypes.map(name => 
            <MenuItem key={ name } value={ name }>
              { strings.editorScreen.rightBar.intentType[name as keyof object] }
            </MenuItem>
            )
          }
        </TextField>
        <Divider className={ classes.divider }/>
          <InputLabel className={ classes.buttonLabel }>
            { strings.editorScreen.rightBar.quickResponsesHelper }
          </InputLabel>
          { renderSpecialButton() }
        <Divider className={ classes.divider }/>
        <Box>
          <AccordionItem title={ strings.editorScreen.rightBar.trainingMaterialsHeader } >
            { renderTrainingSelectionOptions() }
          </AccordionItem>
        </Box>
        <Divider className={ classes.divider }/>
      </>
    );
  }

  const renderSpecialButton = () => {
    return (
      <QuickResponseButton
        editing={ editingQuickResponse }
        selectedIntent={ selectedIntent }
        setEditingButtonFieldValue={ setEditingQuickResponse }
        onUpdateFieldInfo={ onUpdateIntentInfo }
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
        objectKeyConversion={ objectKeyConversion }
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
