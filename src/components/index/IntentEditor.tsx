import * as React from "react";
import * as Keycloak from 'keycloak-js';
import * as actions from "../../actions";
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import Api, { Intent, IntentType, TrainingMaterialType } from "metamind-client";
import { Segment, Dropdown, DropdownProps, Input, Form, InputOnChangeData, Loader, Button } from "semantic-ui-react";
import TrainingMaterialEditor from "./TrainingMaterialEditor";

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
  intent?: Intent
}

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
    if (!this.state.intent) {
      return null;
    }

    const intentTypeOptions = [{
      key: IntentType.OPENNLP,
      text: "OpenNLP", // TODO: localize
      value: IntentType.OPENNLP,
    }, {
      key: IntentType.TEMPLATE,
      text: "Template", // TODO: localize
      value: IntentType.TEMPLATE,
    }, {
      key: IntentType.CONFUSED,
      text: "Confused", // TODO: localize
      value: IntentType.CONFUSED,
    }];

    return (
      <Segment inverted style={{padding: "15px", paddingTop: "100px"}}>
        <Form inverted>
          <Form.Field>
            <label>Intent name</label>
            <Input value={ this.state.intent.name } style={ { width: "100%" } } onChange={ this.onIntentNameChange } />
          </Form.Field>
          <Form.Field>
            <label>Quick response</label>
            <Input value={ this.state.intent.quickResponse } style={ { width: "100%" } } onChange={ this.onIntentQuickResponseChange } />
          </Form.Field>
          <Form.Field>
            <label>Intent type</label>
            <Dropdown onChange={ this.onIntentTypeChange } value={ this.state.intent ? this.state.intent.type : IntentType.OPENNLP } options={ intentTypeOptions } />
          </Form.Field>
          {
            this.renderEditorContents()
          }
          <Form.Field>
            <Button onClick={ this.onSaveIntentClick } disabled={ !this.state.intent.name }>Save intent</Button>
          </Form.Field>     
          {
            <Loader inline active={ this.state.loading }/>
          }
        </Form>
      </Segment>
    );
  }

  /**
   * Renders appropriate editor contents for given intent
   */
  private renderEditorContents() {
    if (!this.state.intent) {
      return null;
    }

    return (
      <div>
        <Form.Field>
          <label>Intent OpenNLP Doccat training material</label>
          <TrainingMaterialEditor trainingMaterialType={ TrainingMaterialType.INTENTOPENNLPDOCCAT } storyId={ this.props.storyId } trainingMaterialId={ this.state.intent.trainingMaterials.intentOpenNlpDoccatId } onTrainingMaterialChange={ this.onTrainingMaterialChangeIntentDoccat }/>
        </Form.Field>
        <Form.Field>
          <label>Intent Regex training material</label>
          <TrainingMaterialEditor trainingMaterialType={ TrainingMaterialType.INTENTREGEX } storyId={ this.props.storyId } trainingMaterialId={ this.state.intent.trainingMaterials.intentRegexId } onTrainingMaterialChange={ this.onTrainingMaterialChangeIntentRegex }/>
        </Form.Field>
        <Form.Field>
          <label>Variable OpenNLP NER training material</label>
          <TrainingMaterialEditor trainingMaterialType={ TrainingMaterialType.VARIABLEOPENNLPNER } storyId={ this.props.storyId } trainingMaterialId={ this.state.intent.trainingMaterials.variableOpenNlpNerId } onTrainingMaterialChange={ this.onTrainingMaterialChangeVariableOpenNlpNer }/>
        </Form.Field>  
        <Form.Field>
          <label>Variable OpenNLP Regex training material</label>
          <TrainingMaterialEditor trainingMaterialType={ TrainingMaterialType.VARIABLEOPENNLPREGEX } storyId={ this.props.storyId } trainingMaterialId={ this.state.intent.trainingMaterials.variableOpenNlpRegex } onTrainingMaterialChange={ this.onTrainingMaterialChangeVariableOpenNlpRegex }/>
        </Form.Field>  
      </div>
    );
  }

  /**
   * Loads intent
   */
  private async loadIntent() {
    this.setState({loading: true});

    const intent = await Api.getIntentsService("not-real-token").findIntent(this.props.storyId, this.props.intentId);
    
    this.setState({
      loading: false,
      intent: intent
    });
  }

  /**
   * Event handler for intent doccat training material change
   * 
   * @param event event
   * @param data data
   */
  private onTrainingMaterialChangeIntentDoccat = async (trainingMaterialId: string) => {
    const { intent } = this.state;
    if (!intent) {
      return;
    }

    this.setState({
      intent: { ... intent, trainingMaterials: { ... intent.trainingMaterials, intentOpenNlpDoccatId: trainingMaterialId } } 
    });
  }

  /**
   * Event handler for intent regex material change
   * 
   * @param event event
   * @param data data
   */
  private onTrainingMaterialChangeIntentRegex = async (trainingMaterialId: string) => {
    const { intent } = this.state;
    if (!intent) {
      return;
    }

    this.setState({
      intent: { ... intent, trainingMaterials: { ... intent.trainingMaterials, intentRegexId: trainingMaterialId } } 
    });
  }

  /**
   * Event handler for intent doccat training material change
   * 
   * @param event event
   * @param data data
   */
  private onTrainingMaterialChangeVariableOpenNlpNer = async (trainingMaterialId: string) => {
    const { intent } = this.state;
    if (!intent) {
      return;
    }

    this.setState({
      intent: { ... intent, trainingMaterials: { ... intent.trainingMaterials, variableOpenNlpNerId: trainingMaterialId } } 
    });
  }

  private onTrainingMaterialChangeVariableOpenNlpRegex = async (trainingMaterialId: string) => {
    const { intent } = this.state;
    if (!intent) {
      return;
    }

    this.setState({
      intent: { ... intent, trainingMaterials: { ... intent.trainingMaterials, variableOpenNlpRegex: trainingMaterialId } } 
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

    this.setState({
      intent: { ... intent, name: data.value as string }
    });
  }

  /**
   * Event handler for intent quck response change
   * 
   * @param event event
   * @param data data
   */
  private onIntentQuickResponseChange = async (event: any, data: InputOnChangeData) => {
    const { intent } = this.state;
    if (!intent) {
      return;
    }
  
    this.setState({
      intent: { ... intent, quickResponse: data.value as string }
    });
  }

  /**
   * Event handler for intent type change
   * 
   * @param event event
   * @param data data
   */
  private onIntentTypeChange = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { intent } = this.state;
    
    if (!intent || !data.value) {
      return;
    }
  
    this.setState({
      intent: { ... intent, type: data.value as IntentType }
    });
  }

  /**
   * Saves an intent
   */
  private onSaveIntentClick = async () => {
    const { intent } = this.state;    

    if (!intent) {
      return;
    }

    const { storyId, intentId } = this.props;
    
    this.setState({
      loading: true
    });
    
    const updatedIntent = await Api.getIntentsService("not-a-real-token").updateIntent(intent, storyId, intentId);

    this.setState({
      loading: false,
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

export default connect(mapStateToProps, mapDispatchToProps)(IntentEditor);