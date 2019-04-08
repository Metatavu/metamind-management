import * as React from "react";
import * as Keycloak from 'keycloak-js';
import * as actions from "../../actions";
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import Api, { TrainingMaterial, TrainingMaterialType } from "metamind-client";
import { Segment, Dropdown, DropdownProps, Form, Input, InputOnChangeData, TextArea, TextAreaProps, Button } from "semantic-ui-react";

/**
 * Component props
 */
interface Props {
  storyId: string,
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance,
  trainingMaterialId?: string,
  trainingMaterialType: TrainingMaterialType,
  onTrainingMaterialSave: (trainingMaterialId?: string) => void
}

/**
 * Component state
 */
interface State {
  loading: boolean,
  trainingMaterials: TrainingMaterial[],
  selectedTrainingMaterialId?: string,
  trainingMaterialName?: string,
  // trainingMaterialType?: TrainingMaterialType,
  trainingMaterialText?: string
}

const NEW_VARIABLE_ID = "NEW";
const NONE_VARIABLE_ID = "NONE";

/**
 * TrainingMaterial editor
 */
class TrainingMaterialEditor extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      trainingMaterials: [],
      loading: false,
      selectedTrainingMaterialId: this.props.trainingMaterialId
    };
  }

  /**
   * Component did mount life-cycle event
   */
  public componentDidMount = async() => {
    this.loadTrainingMaterials(); 
  }

  /**
   * Component did update life-cycle event
   * 
   * @param prevProps previous props
   */
  public componentDidUpdate = async (prevProps: Props, prevState: State) => {
    if (this.props.trainingMaterialId !== prevProps.trainingMaterialId) {
      this.setState({
        selectedTrainingMaterialId: this.props.trainingMaterialId
      });
    }

    if (this.state.selectedTrainingMaterialId !== prevState.selectedTrainingMaterialId) {
      this.loadTrainingMaterials(); 
    }
  } 

  /**
   * Component render method
   */
  public render() {
    return (
      <Segment inverted style={{ padding: "0px" }} loading={ this.state.loading }>
        <Form inverted>
          {
            this.renderTrainingMaterialDropdown()
          }
          {
            this.renderTrainingMaterialEditor()
          }
        </Form>
      </Segment>
    );
  }

  /**
   * Renders editor for OpenNLP trainingMaterials
   */
  private renderTrainingMaterialDropdown = () => {
    if (!this.state.trainingMaterials) {
      return null;
    }

    const options = this.state.trainingMaterials.map((trainingMaterial) => {
      return {
        key: trainingMaterial.id,
        text: trainingMaterial.name,
        value: trainingMaterial.id
      }
    }).concat([
      {
        key: NEW_VARIABLE_ID,
        text: "New", //TODO: localize,
        value: NEW_VARIABLE_ID
      },
      {
        key: NONE_VARIABLE_ID,
        text: "None", // 
        value: NONE_VARIABLE_ID
      }
    ]);

    return <div>
      <Form.Field>
        <label>Select trainingMaterial</label>
        <Dropdown onChange={ this.onTrainingMaterialSelect } value={ this.state.selectedTrainingMaterialId || NONE_VARIABLE_ID } options={ options } />
      </Form.Field>
    </div>
  }

  /**
   * Loads trainingMaterials
   */
  private loadTrainingMaterials = async () => {
    const trainingMaterialsService = Api.getTrainingMaterialsService("not-a-real-token");
    const trainingMaterials = await trainingMaterialsService.listTrainingMaterials(this.props.storyId, this.props.trainingMaterialType);
    const selectedTrainingMaterialId = !this.state.selectedTrainingMaterialId ? NONE_VARIABLE_ID : this.state.selectedTrainingMaterialId;
    const trainingMaterial = !selectedTrainingMaterialId || selectedTrainingMaterialId === NEW_VARIABLE_ID || selectedTrainingMaterialId === NONE_VARIABLE_ID ? null : await trainingMaterialsService.findTrainingMaterial(selectedTrainingMaterialId); 

    this.setState({
      trainingMaterials: trainingMaterials,
      selectedTrainingMaterialId: selectedTrainingMaterialId,
      trainingMaterialName: trainingMaterial ? trainingMaterial.name : "",
      // trainingMaterialType: trainingMaterial ? trainingMaterial.type : TrainingMaterialType.OPENNLPDOCCAT,
      trainingMaterialText: trainingMaterial ? trainingMaterial.text : "",
      loading: false
    });
  }

  /**
   * Renders training material name editor
   */
  private renderTrainingMaterialEditor() {
    if (!this.state.selectedTrainingMaterialId || this.state.selectedTrainingMaterialId === NONE_VARIABLE_ID) {
      return null;
    }

    return (
      <div>
        <Form.Field>
          <label>Enter Name</label>
          <Input value={ this.state.trainingMaterialName } style={ { width: "100%" } } onChange={(event: any, data: InputOnChangeData ) => this.setState({trainingMaterialName: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <label>Enter text</label>
          <TextArea value={ this.state.trainingMaterialText } style={ { width: "100%" } } onChange={(event: any, data: TextAreaProps ) => this.setState({trainingMaterialText: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <Button onClick={ this.onSaveTrainingMaterialClick } disabled={ !this.state.trainingMaterialName || !this.state.trainingMaterialText }>Save training material</Button>
        </Form.Field>     
      </div>
    );
  }

  /**
   * Event handler for intent type change
   * 
   * @param event event
   * @param data data
   */
  private onTrainingMaterialSelect = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    this.setState({
      selectedTrainingMaterialId: data.value as string
    });
  }

  /**
   * Updates trainingMaterial
   */
  private onSaveTrainingMaterialClick = async () => {
    const { selectedTrainingMaterialId, trainingMaterialName, trainingMaterialText } = this.state;

    if (!trainingMaterialName || !trainingMaterialText) {
      return;
    }

    this.setState({loading: true});

    const trainingMaterialsService = Api.getTrainingMaterialsService("not-a-real-token");

    if (selectedTrainingMaterialId === NEW_VARIABLE_ID) {
      const trainingMaterial = await trainingMaterialsService.createTrainingMaterial({
        storyId: this.props.storyId,
        name: trainingMaterialName,
        type: this.props.trainingMaterialType,
        text: trainingMaterialText
      });  

      this.setState({
        trainingMaterials: [ trainingMaterial ].concat( this.state.trainingMaterials ),
        loading: false,
        selectedTrainingMaterialId: trainingMaterial.id
      });

      this.props.onTrainingMaterialSave(trainingMaterial.id);
    } else if (this.state.selectedTrainingMaterialId) {
      await trainingMaterialsService.updateTrainingMaterial({
        name: trainingMaterialName,
        type: this.props.trainingMaterialType,
        text: trainingMaterialText
      }, this.state.selectedTrainingMaterialId);  

      this.setState({
        loading: false
      });

      this.props.onTrainingMaterialSave(this.state.selectedTrainingMaterialId);
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(TrainingMaterialEditor);