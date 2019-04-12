import * as React from "react";
import * as Keycloak from 'keycloak-js';
import * as actions from "../../actions";
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import Api, { Variable, VariableType } from "metamind-client";
import { Segment, Dropdown, DropdownProps, Form, Input, InputOnChangeData, TextArea, TextAreaProps, Button } from "semantic-ui-react";

/**
 * Component props
 */
interface Props {
  storyId: string,
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance
}

/**
 * Component state
 */
interface State {
  loading: boolean,
  variables: Variable[],
  selectedVariableId?: string,
  variableName?: string,
  variableType?: VariableType,
  variableValidationScript?: string
}

const NEW_VARIABLE_ID = "NEW";

/**
 * Variable editor
 */
class VariableEditor extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      variables: [],
      loading: false
    };
  }

  /**
   * Component did mount life-cycle event
   */
  public componentDidMount = async() => {
    this.loadVariables(); 
  }

  /**
   * Component did update life-cycle event
   * 
   * @param prevProps previous props
   */
  public componentDidUpdate = async (prevProps: Props, prevState: State) => {
    if (this.state.selectedVariableId !== prevState.selectedVariableId) {
      this.loadVariables(); 
    }
  } 

  /**
   * Component render method
   */
  public render() {
    return (
      <Segment inverted style={{ padding: "15px" }} loading={ this.state.loading }>
        <Form inverted>
          {
            this.renderVariableDropdown()
          }
          {
            this.renderVariableEditor()
          }
        </Form>
      </Segment>
    );
  }

  /**
   * Renders editor for OpenNLP variables
   */
  private renderVariableDropdown = () => {
    if (!this.state.variables) {
      return null;
    }

    const options = this.state.variables.map((variable) => {
      return {
        key: variable.id,
        text: variable.name,
        value: variable.id
      }
    }).concat([
      {
        key: NEW_VARIABLE_ID,
        text: "New", //TODO: localize,
        value: NEW_VARIABLE_ID
      }
    ]);

    return <div>
      <Form.Field>
        <label>Select variable</label>
        <Dropdown onChange={ this.onVariableSelect } value={ this.state.selectedVariableId } options={ options } />
      </Form.Field>
    </div>
  }

  /**
   * Loads variables
   */
  private loadVariables = async () => {
    const variablesService = Api.getVariablesService(this.props.keycloak ? this.props.keycloak.token! : "");
    const variables = await variablesService.listVariables(this.props.storyId);
    const selectedVariableId = !this.state.selectedVariableId ? variables.length ? variables[0].id : NEW_VARIABLE_ID : this.state.selectedVariableId;
    const variable = !selectedVariableId || selectedVariableId === NEW_VARIABLE_ID ? null : await variablesService.findVariable(this.props.storyId, selectedVariableId); 

    this.setState({
      variables: variables,
      selectedVariableId: selectedVariableId,
      variableName: variable ? variable.name : "",
      variableType: variable ? variable.type : VariableType.STRING,
      variableValidationScript: variable ? variable.validationScript : "",
      loading: false
    });
  }

  /**
   * Renders training material name editor
   */
  private renderVariableEditor() {
    if (!this.state.selectedVariableId) {
      return null;
    }

    const typeOptions = [{
      key: VariableType.STRING,
      text: "String", // TODO: Localize
      value: VariableType.STRING
    }, {
      key: VariableType.NUMBER,
      text: "Number", // TODO: Localize
      value: VariableType.NUMBER
    }];

    return (
      <div>
        <Form.Field>
          <label>Variable name</label>
          <Input value={ this.state.variableName } style={ { width: "100%" } } onChange={(event: any, data: InputOnChangeData ) => this.setState({variableName: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <label>Select type</label>
          <Dropdown value={ this.state.variableType } onChange={(event: any, data: DropdownProps ) => this.setState({variableType: data.value as VariableType })} options={ typeOptions } />
        </Form.Field>
        <Form.Field>
          <label>Validation script</label>
          <TextArea value={ this.state.variableValidationScript } style={ { width: "100%" } } onChange={(event: any, data: TextAreaProps ) => this.setState({variableValidationScript: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <Button onClick={ this.onSaveVariableClick } disabled={ !this.state.variableName }>Save variable</Button>
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
  private onVariableSelect = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    this.setState({
      selectedVariableId: data.value as string
    });
  }

  /**
   * Updates variable
   */
  private onSaveVariableClick = async () => {
    const { selectedVariableId, variableName, variableType, variableValidationScript } = this.state;

    if (!variableName || !variableType) {
      return;
    }

    this.setState({loading: true});

    const variablesService = Api.getVariablesService(this.props.keycloak ? this.props.keycloak.token! : "");

    if (selectedVariableId === NEW_VARIABLE_ID) {
      const variable = await variablesService.createVariable({
        name: variableName,
        type: variableType,
        validationScript: variableValidationScript 
      }, this.props.storyId);  

      this.setState({
        variables: [ variable ].concat( this.state.variables ),
        loading: false,
        selectedVariableId: variable.id
      });
    } else if (this.state.selectedVariableId) {
      await variablesService.updateVariable({
        name: variableName,
        type: variableType,
        validationScript: variableValidationScript 
      }, this.props.storyId, this.state.selectedVariableId);  

      this.setState({
        loading: false
      });
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

export default connect(mapStateToProps, mapDispatchToProps)(VariableEditor);