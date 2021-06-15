import { Box, Drawer, Tab, Tabs, TextField, Button, MenuItem, InputLabel, List, ListItem, ListItemSecondaryAction, IconButton, Card, CardContent } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Api from "../../../api/api";
import { TokenizerType, KnotType, Story, Knot, Intent, IntentType, TrainingMaterial, TrainingMaterialType, TrainingMaterialVisibility } from "../../../generated/client/models";
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
import CustomLinkModel from "../../diagram-components/custom-link/custom-link-model";
import AccordionItem from "../../generic/accordion-item";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { v4 as uuid } from "uuid";

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
  const [ quickResponse, setQuickResponse ] = React.useState(
    selectedIntent?.quickResponse ? selectedIntent.quickResponse : strings.editorScreen.rightBar.quickResponseButtonDefault
  );
  const [ editingQuickResponse, setEditingQuickResponse ] = React.useState(false);
  const [ editingTrainingMaterial, setEditingTrainingMaterial ] = React.useState(false);
  const [ selectedTrainingMaterialType, setSelectedTrainingMaterialType ] = React.useState<TrainingMaterialType | null>(null);
  const [ editedTrainingMaterial, setEditedTrainingMaterial ] = React.useState<TrainingMaterial | null>(null);


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
   * Event handler for add training material click
   * 
   * @param name name of the trainig material type
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

  const onSaveTrainingMaterialClick = async (action: string) => {
    // let updatedTrainingMaterial: TrainingMaterial;
    if (!accessToken || !editedTrainingMaterial || !trainingMaterial || !selectedIntent?.id) {
      return;
    }

    console.log("editedTrainingMaterial", editedTrainingMaterial);
    console.log("storyId", storyId);

    if (action === "update") {
      // try {
      //   updatedTrainingMaterial = await Api.getTrainingMaterialApi(accessToken).updateTrainingMaterial({
      //     trainingMaterialId: editedTrainingMaterial.id,
      //     trainingMaterial: editedTrainingMaterial
      //   });
      // } catch (error) {
      //   throw error;
      // }
      // setStoryData({
      //   ...storyData,
      //   trainingMaterial: trainingMaterial.map(item => item.id === updatedTrainingMaterial.id ? updatedTrainingMaterial : item)
      // });
    }
    if (action === "create") {
      try {
        const trainingMaterialApi = Api.getTrainingMaterialApi(accessToken);
        const list = await trainingMaterialApi.listTrainingMaterials({
          storyId
        });

        console.log(list);
        const updatedTrainingMaterial = await Api.getTrainingMaterialApi(accessToken).createTrainingMaterial({
          trainingMaterial: editedTrainingMaterial
        });
        console.log("Updated:", updatedTrainingMaterial);

      } catch (error) {
        throw error;
      }
      setStoryData({
        ...storyData,
        // trainingMaterial: [ ...trainingMaterial, updatedTrainingMaterial ]
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
  const onUpdateIntentInfo = async (event: React.ChangeEvent<any>, intent: Intent) => {
    let { name, value } = event?.target;
    if (!accessToken || !intents || !intent?.id) {
      return;
    }

    const updatedIntent = await Api.getIntentsApi(accessToken).updateIntent({
      storyId: storyId,
      intentId: intent.id,
      intent: { ...intent, [name]: value }
    });

    setStoryData({
      ...storyData,
      intents: intents.map(item => item.id === updatedIntent.id ? updatedIntent : item)
    });
  }

  const onUpdateEditedTrainingMaterial = (event: React.ChangeEvent<any>) => {
    const { name, value } = event?.target;
    if (!editedTrainingMaterial) {
      return;
    }

    setEditedTrainingMaterial({ ...editedTrainingMaterial, [name]: value });
  }

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

    console.log(trainingMaterialList);

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
            defaultValue={ selectedIntent.name }
            onChange={ (e: any) => onUpdateIntentInfo(e, selectedIntent) }
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
          onChange={ (e: any) => onUpdateIntentInfo(e, selectedIntent) }
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
            <div className={ classes.trainingSelectionOptions }>
              { renderTrainingSelectionOptions() }
            </div>
          </AccordionItem>
        </Box>
        <Divider className={ classes.divider }/>
      </>
    );
  }

  const renderSpecialButton = () => {
    return (
      <>
        { !editingQuickResponse && 
          <Button
            className={ classes.button }
            onClick={ () => setEditingQuickResponse(true) }
          >
            { quickResponse }
          </Button>
        }
        { editingQuickResponse &&
          <List>
            <ListItem
              className={ classes.specialButton }
              button={ false }
            >
              <TextField
                name="quickResponse"
                value={ quickResponse }
                InputProps={ { disableUnderline: true } }
                onChange={ (e: any) => setQuickResponse(e.target.value) }
              />
              <ListItemSecondaryAction>
              <IconButton
                  edge="end"
                  onClick={ () => setEditingQuickResponse(false) }
                >
                  <HighlightOffIcon className={ classes.buttonIcon }/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        }
      </>
    );
  }

  const renderTrainingSelectionOptions = () => {
    return (
      <>
        { Object.keys(TrainingMaterialType).map(name =>
          <div className={ classes.trainingSelectionOption }>
            <InputLabel className={ classes.buttonLabel }>
              { strings.editorScreen.rightBar.trainingMaterials[name as keyof object] }
            </InputLabel>
            <Card className={ classes.trainingSelectionOptionContent }>
              <CardContent>
                <TextField
                  label={ strings.editorScreen.rightBar.selectExisting }
                  name="trainingMaterials"
                  select
                  defaultValue={ "none" }
                  onChange={ () => {} }
                  disabled={ editingTrainingMaterial }
                >
                  <MenuItem key={ "none" } value={ "none" }>
                    { strings.editorScreen.rightBar.selectTrainingMaterial }
                  </MenuItem>
                  { trainingMaterial && 
                    // console.log(storyId, trainingMaterial)
                    trainingMaterial.filter(item => item.storyId === story?.id).map(item =>
                      <MenuItem key={ item.name } value={ item.name }>
                      { item.name }
                      </MenuItem>
                    )
                  }
                </TextField>
                { !editingTrainingMaterial &&
                  <Button
                    className={ classes.trainingSelectionAddButton }
                    variant="contained"
                    onClick={ () => onAddTrainingMaterialClick(name as keyof object) }
                  >
                    { strings.editorScreen.rightBar.createNew }
                  </Button>
                }
                { (editingTrainingMaterial && selectedTrainingMaterialType === name as keyof object) &&
                  <>
                    <TextField
                      className={ classes.trainingSelectionField }
                      label={ strings.editorScreen.rightBar.name }
                      name="name"
                      variant="outlined"
                      value={ editedTrainingMaterial?.name ?? "" }
                      autoFocus
                      onChange={ onUpdateEditedTrainingMaterial }
                    />
                    <TextField
                      className={ classes.trainingSelectionField }
                      label={ strings.editorScreen.rightBar.trainingMaterialsHeader }
                      name="text"
                      variant="outlined"
                      value={ editedTrainingMaterial?.text ?? "" }
                      multiline={ true }
                      rows={ 3 }
                      onChange={ onUpdateEditedTrainingMaterial }
                    />
                    <div className={ classes.actionButtons }>
                      <Button
                        className={ `${classes.actionButton} ${classes.removeButton}`}
                        variant="outlined"
                        onClick={ () => { setEditingTrainingMaterial(false); setEditedTrainingMaterial(null); } }
                      >
                        { strings.generic.remove }
                      </Button>
                      <Button
                        className={ classes.actionButton }
                        variant="outlined"
                        onClick={ () => onSaveTrainingMaterialClick("create") }
                      >
                        { strings.generic.save }
                      </Button>
                    </div>
                  </>
                }
              </CardContent>
            </Card>
          </div>
          )
        }
      </>
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
      pageTitle="Story name here"
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
