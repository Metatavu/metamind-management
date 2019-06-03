import * as Keycloak from "keycloak-js";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IStoreState } from "src/types";
import * as actions from "../../actions";

import Api, { Script } from "metamind-client";
import { Button, Dropdown, DropdownProps, Form, Input, InputOnChangeData, Segment, TextArea, TextAreaProps } from "semantic-ui-react";

/**
 * Component props
 */
interface IProps {
  storyId: string;
  authenticated: boolean;
  keycloak?: Keycloak.KeycloakInstance;
}

/**
 * Component state
 */
interface IState {
  loading: boolean;
  scripts: Script[];
  selectedScriptId?: string;
  scriptName?: string;
  scriptLanguage?: string;
  scriptContent?: string;
  scriptVersion?: string;
}

const NEW_SCRIPT_ID = "NEW";

/**
 * Script editor
 */
class ScriptEditor extends React.Component<IProps, IState> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
      scripts: [],
    };
  }

  /**
   * Component did mount life-cycle event
   */
  public componentDidMount = async () => {
    this.loadScripts();
  }

  /**
   * Component did update life-cycle event
   *
   * @param prevProps previous props
   */
  public componentDidUpdate = async (prevProps: IProps, prevState: IState) => {
    if (this.state.selectedScriptId !== prevState.selectedScriptId) {
      this.loadScripts();
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
            this.renderScriptDropdown()
          }
          {
            this.renderScriptEditor()
          }
        </Form>
      </Segment>
    );
  }

  /**
   * Renders editor for OpenNLP scripts
   */
  private renderScriptDropdown = () => {
    if (!this.state.scripts) {
      return null;
    }

    const options = this.state.scripts.map((script) => {
      return {
        key: script.id,
        text: script.name,
        value: script.id,
      };
    }).concat([
      {
        key: NEW_SCRIPT_ID,
        text: "New", // TODO: localize,
        value: NEW_SCRIPT_ID,
      },
    ]);

    return <div>
      <Form.Field>
        <label>Select script</label>
        <Dropdown onChange={ this.onScriptSelect } value={ this.state.selectedScriptId } options={ options } />
      </Form.Field>
    </div>;
  }

  /**
   * Loads scripts
   */
  private loadScripts = async () => {
    const scriptsService = Api.getScriptsService(this.props.keycloak ? this.props.keycloak.token! : "");
    const scripts = await scriptsService.listScripts();
    const selectedScriptId = !this.state.selectedScriptId ? scripts.length ? scripts[0].id : NEW_SCRIPT_ID : this.state.selectedScriptId;
    const script = !selectedScriptId || selectedScriptId === NEW_SCRIPT_ID ? null : await scriptsService.findScript(selectedScriptId);

    this.setState({
      loading: false,
      scriptContent: script ? script.content : "",
      scriptLanguage: script ? script.language : "",
      scriptName: script ? script.name : "",
      scriptVersion: script ? script.version : "",
      scripts,
      selectedScriptId,
    });
  }

  /**
   * Renders training material name editor
   */
  private renderScriptEditor() {
    if (!this.state.selectedScriptId) {
      return null;
    }

    return (
      <div>
        <Form.Field>
          <label>Script name</label>
          <Input
          value={ this.state.scriptName }
          style={ { width: "100%" } }
          onChange={(event: any, data: InputOnChangeData ) => this.setState({scriptName: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <label>Script version</label>
          <Input
          value={ this.state.scriptVersion }
          style={ { width: "100%" } }
          onChange={(event: any, data: InputOnChangeData ) => this.setState({scriptVersion: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <label>Script language</label>
          <Input value={ this.state.scriptLanguage }
          style={ { width: "100%" } }
          onChange={(event: any, data: InputOnChangeData ) => this.setState({scriptLanguage: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <label>Script content</label>
          <TextArea
          value={ this.state.scriptContent }
          style={ { width: "100%" } }
          onChange={(event: any, data: TextAreaProps ) => this.setState({scriptContent: data.value as string})} />
        </Form.Field>
        <Form.Field>
          <Button
          onClick={ this.onSaveScriptClick }
          disabled={ !this.state.scriptName ||
          !this.state.scriptLanguage ||
          !this.state.scriptContent }>Save script</Button>
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
  private onScriptSelect = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    this.setState({
      selectedScriptId: data.value as string,
    });
  }

  /**
   * Updates script
   */
  private onSaveScriptClick = async () => {
    const { selectedScriptId, scriptName, scriptLanguage, scriptContent, scriptVersion } = this.state;

    if (!scriptName || !scriptLanguage || !scriptContent || !scriptVersion) {
      return;
    }

    this.setState({loading: true});

    const scriptsService = Api.getScriptsService(this.props.keycloak ? this.props.keycloak.token! : "");

    if (selectedScriptId === NEW_SCRIPT_ID) {
      const script = await scriptsService.createScript({
        content: scriptContent,
        language: scriptLanguage,
        name: scriptName,
        version: scriptVersion,
      });

      this.setState({
        loading: false,
        scripts: [ script ].concat( this.state.scripts ),
        selectedScriptId: script.id,
      });
    } else if (this.state.selectedScriptId) {
      await scriptsService.updateScript({
        content: scriptContent,
        language: scriptLanguage,
        name: scriptName,
        version: scriptVersion,
      }, this.state.selectedScriptId);

      this.setState({
        loading: false,
      });
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

export default connect(mapStateToProps, mapDispatchToProps)(ScriptEditor);
