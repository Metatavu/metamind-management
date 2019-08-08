import * as Keycloak from "keycloak-js";
import { KeycloakInstance } from "keycloak-js";
import Api, { TrainingMaterial, TrainingMaterialType, TrainingMaterialVisibility } from "metamind-client";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IStoreState } from "src/types";
import * as actions from "../../actions";

import {Button, Checkbox, CheckboxProps, Dropdown, DropdownProps, Form, FormField, Input, InputOnChangeData, Segment, TextArea, TextAreaProps} from "semantic-ui-react";

/**
 * Component props
 */
interface IProps {
  storyId: string;
  authenticated: boolean;
  keycloak?: Keycloak.KeycloakInstance;
  trainingMaterialId?: string;
  trainingMaterialType: TrainingMaterialType;
  onTrainingMaterialChange: (trainingMaterialId?: string) => void;
  onTrainingMaterialSave?: (trainingMaterialId?: string) => void;
}

/**
 * Component state
 */
interface IState {
  loading: boolean;
  trainingMaterials: TrainingMaterial[];
  selectedTrainingMaterialId?: string;
  trainingMaterialName?: string;
  trainingMaterialText?: string;
  trainingMaterialVisibility: TrainingMaterialVisibility;
  visibilityStatus?: string;
}

const NEW_VARIABLE_ID = "NEW";
const NONE_VARIABLE_ID = "NONE";

/**
 * TrainingMaterial editor
 */
class TrainingMaterialEditor extends React.Component<IProps, IState> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
      selectedTrainingMaterialId: this.props.trainingMaterialId,
      trainingMaterialVisibility: TrainingMaterialVisibility.LOCAL,
      trainingMaterials: [],
    };
  }

  /**
   * Component did mount life-cycle event
   */
  public componentDidMount = async () => {
    this.loadTrainingMaterials();
  }

  /**
   * Component did update life-cycle event
   *
   * @param prevProps previous props
   */
  public componentDidUpdate = async (prevProps: IProps, prevState: IState) => {
    if (this.props.trainingMaterialId !== prevProps.trainingMaterialId) {
      this.setState({
        selectedTrainingMaterialId: this.props.trainingMaterialId,
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
        value: trainingMaterial.id,
      };
    }).concat([
      {
        key: NEW_VARIABLE_ID,
        text: "New", // TODO: localize,
        value: NEW_VARIABLE_ID,
      },
      {
        key: NONE_VARIABLE_ID,
        text: "None", //
        value: NONE_VARIABLE_ID,
      },
    ]);

    return <div>
      <Form.Field>
        <label>Select trainingMaterial</label>
        <Dropdown onChange={ this.onTrainingMaterialSelect } value={ this.state.selectedTrainingMaterialId || NONE_VARIABLE_ID } options={ options } />
      </Form.Field>
    </div>;
  }

  /**
   * Loads trainingMaterials
   */
  private loadTrainingMaterials = async () => {
    const trainingMaterialsService = Api.getTrainingMaterialsService(this.props.keycloak ? this.props.keycloak.token! : "");
    const trainingMaterials = await trainingMaterialsService.listTrainingMaterials(this.props.storyId, this.props.trainingMaterialType);
    const selectedTrainingMaterialId = !this.state.selectedTrainingMaterialId ? NONE_VARIABLE_ID : this.state.selectedTrainingMaterialId;
    const trainingMaterial = !selectedTrainingMaterialId ||
    selectedTrainingMaterialId === NEW_VARIABLE_ID ||
    selectedTrainingMaterialId === NONE_VARIABLE_ID ?
    null : await trainingMaterialsService.findTrainingMaterial(selectedTrainingMaterialId);

    this.setState({
      loading: false,
      selectedTrainingMaterialId,
      trainingMaterialName: trainingMaterial ? trainingMaterial.name : "",
      trainingMaterialText: trainingMaterial ? trainingMaterial.text : "",
      trainingMaterialVisibility: trainingMaterial ? trainingMaterial.visibility || TrainingMaterialVisibility.LOCAL : TrainingMaterialVisibility.LOCAL,
      trainingMaterials,
    });
  }

  /**
   * Renders training material name editor
   */
  private renderTrainingMaterialEditor() {
    if (!this.state.selectedTrainingMaterialId || this.state.selectedTrainingMaterialId === NONE_VARIABLE_ID) {
      return null;
    }

    // const intentVisibilityOptions = [{
    //   key: TrainingMaterialVisibility.STORY,
    //   text: "Story", // TODO: localize
    //   value: TrainingMaterialVisibility.STORY,
    // }, {
    //   key: TrainingMaterialVisibility.LOCAL,
    //   text: "Local", // TODO: localize
    //   value: TrainingMaterialVisibility.LOCAL,
    // }];

    return (
      <div>
        <Form.Field>
          <label>Enter Name</label>
          <Input
          value={ this.state.trainingMaterialName }
          style={ { width: "100%" } }
          onChange={(event: any, data: InputOnChangeData ) => this.setState({trainingMaterialName: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <label>Enter text</label>
          <TextArea
          value={ this.state.trainingMaterialText }
          style={ { width: "100%" } }
          onChange={(event: any, data: TextAreaProps ) => this.setState({trainingMaterialText: data.value as string})} />
        </Form.Field>
        <FormField>
          <label>Visible: { this.state.trainingMaterialVisibility }</label>
          <Checkbox label="Make visible" checked={this.state.trainingMaterialVisibility === TrainingMaterialVisibility.STORY} onChange={this.onVisibilityChange}>
              {/* <Input type="checkbox" checked={this.state.trainingMaterialVisibility == TrainingMaterialVisibility.STORY} onChange={this.onVisibilityChange} /> */}
          </Checkbox>
        </FormField>
        <Form.Field>
          <Button
          onClick={ this.onSaveTrainingMaterialClick }
          disabled={ !this.state.trainingMaterialName || !this.state.trainingMaterialText }>Save training material</Button>
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
    const trainingMaterialId = data.value as string;

    this.setState({
      selectedTrainingMaterialId: trainingMaterialId,
    });

    this.props.onTrainingMaterialChange(trainingMaterialId === NEW_VARIABLE_ID || trainingMaterialId === NONE_VARIABLE_ID ? undefined : trainingMaterialId);
  }

  /**
   * Updates trainingMaterial
   */
  private onSaveTrainingMaterialClick = async () => {
    const { selectedTrainingMaterialId, trainingMaterialName, trainingMaterialText, trainingMaterialVisibility } = this.state;

    if (!trainingMaterialName || !trainingMaterialText) {
      return;
    }

    this.setState({loading: true});

    const trainingMaterialsService = Api.getTrainingMaterialsService(this.props.keycloak ? this.props.keycloak.token! : "");

    if (selectedTrainingMaterialId === NEW_VARIABLE_ID) {
      const trainingMaterial = await trainingMaterialsService.createTrainingMaterial({
        name: trainingMaterialName,
        storyId: this.props.storyId,
        text: trainingMaterialText,
        type: this.props.trainingMaterialType,
        visibility: trainingMaterialVisibility,
      });

      this.setState({
        loading: false,
        selectedTrainingMaterialId: trainingMaterial.id,
        trainingMaterials: [ trainingMaterial ].concat( this.state.trainingMaterials ),
      });
      if ( this.props.onTrainingMaterialSave ) {
        this.props.onTrainingMaterialSave(trainingMaterial.id);
      }
      this.props.onTrainingMaterialChange(trainingMaterial.id);
    } else if (this.state.selectedTrainingMaterialId) {
      await trainingMaterialsService.updateTrainingMaterial({
        name: trainingMaterialName,
        text: trainingMaterialText,
        type: this.props.trainingMaterialType,
        visibility: trainingMaterialVisibility,
      }, this.state.selectedTrainingMaterialId);

      this.setState({
        loading: false,
      });
      if ( this.props.onTrainingMaterialSave ) {
        this.props.onTrainingMaterialSave(this.state.selectedTrainingMaterialId);
      }
    }

  }

  private onVisibilityChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    if (data.checked) {
      this.setState({trainingMaterialVisibility: TrainingMaterialVisibility.STORY});
    } else {
      this.setState({trainingMaterialVisibility: TrainingMaterialVisibility.LOCAL});
    }
  }
}

export function mapStateToProps(state: IStoreState) {
  return {
    authenticated: state.authenticated,
    keycloak: state.keycloak,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
    onLogin: (keycloak: KeycloakInstance, authenticated: boolean) => dispatch(actions.userLogin(keycloak, authenticated)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingMaterialEditor);
