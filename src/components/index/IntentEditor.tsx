import * as React from "react";
import * as Keycloak from 'keycloak-js';
import * as actions from "../../actions";
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import Api, { Intent, TrainingMaterial } from "metamind-client";
import { Segment, Dropdown, DropdownProps, TextArea, Button, TextAreaProps, Input, Form, InputOnChangeData, Loader } from "semantic-ui-react";

/**
 * Component props
 */
interface Props {
  storyId: string,
  intentId: string,
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance
}

/**
 * Component state
 */
interface State {
  loading: boolean,
  intent?: Intent,
  intentName?: string,
  selectedTrainingMaterialId?: string,
  trainingMaterialName?: string, 
  trainingMaterialText?: string,
  trainingMaterial?: TrainingMaterial
  trainingMaterials: TrainingMaterial[]
}

const NEW_TRAINING_MATERIAL_ID = "NEW";
const NONE_TRAINING_MATERIAL_ID = "NONE";

/**
 * Intent editor
 */
class IntentEditor extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      trainingMaterials: [],
      loading: false
    };
  }

  /**
   * Component did mount life-cycle event
   */
  public componentDidMount = async() => {
    this.loadIntent();    
  }

  /**
   * Component did update life-cycle event
   * 
   * @param prevProps previous props
   */
  public componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.intentId !== this.props.intentId) {
      this.loadIntent();
    }
  } 

  /**
   * Component render method
   */
  public render() {
    const trainingMaterialOptions = this.state.trainingMaterials.map((trainingMaterial) => {
      return {
        key: trainingMaterial.id,
        text: trainingMaterial.name,
        value: trainingMaterial.id
      }
    }).concat([
      {
        key: NONE_TRAINING_MATERIAL_ID,
        text: "None", //TODO: localize,
        value: NONE_TRAINING_MATERIAL_ID
      }, {
        key: NEW_TRAINING_MATERIAL_ID,
        text: "New", //TODO: localize,
        value: NEW_TRAINING_MATERIAL_ID
      }
    ]);

    return (
      <Segment inverted style={{padding: "15px", paddingTop: "100px"}}>
        <Form inverted>
          <Form.Field>
            <label>Intent name</label>
            <Input value={ this.state.intentName } style={ { width: "100%" } } onChange={ this.onIntentNameChange } />
          </Form.Field>
          <Form.Field>
            <label>Select training material</label>
            <Dropdown onChange={this.onTrainingMaterialSelect} value={this.state.selectedTrainingMaterialId } options={trainingMaterialOptions} />
          </Form.Field>
          {
            this.renderTrainingMaterialNameEditor()
          }
          {
            this.renderTrainingMaterialTextEditor()
          }
          {
            this.renderTrainingMaterialSave()
          }
          {
            <Loader inline active={ this.state.loading }/>
          }
        </Form>
      </Segment>
    );
  }

  /**
   * Renders training material name editor
   */
  private renderTrainingMaterialNameEditor() {
    if (this.state.selectedTrainingMaterialId === NONE_TRAINING_MATERIAL_ID) {
      return null;
    }

    return (
      <Form.Field>
        <label>Training material name</label>
        <Input value={ this.state.trainingMaterialName } style={ { width: "100%" } } onChange={(event: any, data: InputOnChangeData ) => this.setState({trainingMaterialName: data.value as string})} />
      </Form.Field>
    );
  }

  /**
   * Renders training material text editor
   */
  private renderTrainingMaterialTextEditor() {
    if (this.state.selectedTrainingMaterialId === NONE_TRAINING_MATERIAL_ID) {
      return null;
    }

    return (
      <Form.Field>
        <label>Training material text</label>
        <TextArea rows={ 15 } style={ { width: "100%" } } onChange={(event: any, data: TextAreaProps) => this.setState({trainingMaterialText: data.value as string})} value={this.state.trainingMaterialText} />
      </Form.Field>  
    );
  }

  /**
   * Renders training material save button
   */
  private renderTrainingMaterialSave() {
    if (this.state.selectedTrainingMaterialId === NONE_TRAINING_MATERIAL_ID) {
      return null;
    }

    return (
      <Form.Field>
        <Button onClick={ this.updateTrainingMaterial } disabled={ this.getSaveTrainingMaterialDisabled() }>Save training material</Button>
      </Form.Field>     
    );
  }

  /**
   * Returns whether training material save button should be disabled
   */
  private getSaveTrainingMaterialDisabled() {
    if (this.state.selectedTrainingMaterialId === NONE_TRAINING_MATERIAL_ID) {
      return false;
    }

    return !this.state.trainingMaterialName || !this.state.trainingMaterialText;
  }

  /**
   * Loads intent
   */
  private async loadIntent() {
    this.setState({loading: true});

    const intent = await Api.getIntentsService("not-real-token").findIntent(this.props.storyId, this.props.intentId);
    const trainingMaterialService = await Api.getTrainingMaterialsService("not-a-real-token");
    const trainingMaterial = intent.trainingMaterialId ? await trainingMaterialService.findTrainingMaterial(intent.trainingMaterialId) : undefined;
    const trainingMaterials = await trainingMaterialService.listTrainingMaterials();

    this.setState({
      loading: false,
      intent: intent,
      intentName: intent.name,
      trainingMaterial: trainingMaterial,
      selectedTrainingMaterialId: intent.trainingMaterialId || NONE_TRAINING_MATERIAL_ID,
      trainingMaterials: trainingMaterials,
      trainingMaterialText: trainingMaterial ? trainingMaterial.text : "",
      trainingMaterialName: trainingMaterial ? trainingMaterial.name : ""
    });
  }

  /**
   * Updates training material
   */
  private updateTrainingMaterial = async () => {
    const { storyId, intentId } = this.props;
    const { selectedTrainingMaterialId, trainingMaterialText, intent } = this.state;

    if (!intent || !this.state.trainingMaterialName) {
      return;
    }

    this.setState({loading: true});
    let { trainingMaterial } = this.state; 
    const trainingMaterialService = Api.getTrainingMaterialsService("not-a-real-token");
    if (selectedTrainingMaterialId === NEW_TRAINING_MATERIAL_ID) {
      trainingMaterial = await trainingMaterialService.createTrainingMaterial({
        name: this.state.trainingMaterialName,
        storyId: storyId,
        text: trainingMaterialText || ""
      });
      intent.trainingMaterialId = trainingMaterial.id;
      await Api.getIntentsService("not-a-real-token").updateIntent(intent, storyId, intentId);
    } else if (trainingMaterial) {
      trainingMaterial = await trainingMaterialService.updateTrainingMaterial({
        name: this.state.trainingMaterialName,
        storyId: storyId,
        text: trainingMaterialText || ""
      }, trainingMaterial.id!);
    }

    this.setState({
      loading: false,
      selectedTrainingMaterialId: trainingMaterial ? trainingMaterial.id : undefined
    });

  }

  /**
   * Event handler for intent name change
   * 
   * @param event event
   * @param data data
   */
  private onIntentNameChange = async (event: any, data: InputOnChangeData) => {
    const { intent } = this.state;
    if (!intent || !data.value) {
      return;
    }

    const { storyId, intentId } = this.props;
    intent.name = data.value as string;
    
    this.setState({
      loading: true,
      intentName: intent.name
    });
    
    const updatedIntent = await Api.getIntentsService("not-a-real-token").updateIntent(intent, storyId, intentId);

    this.setState({
      loading: false,
      intent: updatedIntent
    });
  }

  /**
   * Training material select event handler
   * 
   * @param event event
   * @param data data
   */
  private onTrainingMaterialSelect = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { intent } = this.state;
    if (!intent) {
      return;
    }

    const trainingMaterialId = data.value as string || undefined;

    const { storyId, intentId } = this.props;
    intent.trainingMaterialId = trainingMaterialId === NEW_TRAINING_MATERIAL_ID  || trainingMaterialId === NONE_TRAINING_MATERIAL_ID ? undefined : trainingMaterialId;
    this.setState({loading: true});
    const updatedIntent = await Api.getIntentsService("not-a-real-token").updateIntent(intent, storyId, intentId);
    this.setState({
      loading: false,
      selectedTrainingMaterialId: trainingMaterialId,
      intent: updatedIntent
    });
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    authenticated: state.authenticated,
    keycloak: state.keycloak
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onLogin: (keycloak: KeycloakInstance, authenticated: boolean) => dispatch(actions.userLogin(keycloak, authenticated))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntentEditor);;