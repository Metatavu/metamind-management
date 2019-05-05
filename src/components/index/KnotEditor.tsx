import * as React from "react";
import * as Keycloak from 'keycloak-js';
import * as actions from "../../actions";
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import Api, { Knot, TokenizerType, KnotType } from "metamind-client";
import { Segment, Input, Form, InputOnChangeData, Loader, TextArea, TextAreaProps, Dropdown, DropdownProps } from "semantic-ui-react";

/**
 * Component props
 */
interface Props {
  storyId: string,
  knotId: string,
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance
  onKnotUpdated: (knot: Knot) => void
}

/**
 * Component state
 */
interface State {
  loading: boolean,
  knot?: Knot,
  knotName?: string,
  knotContent?: string,
  knotHint?: string
}

/**
 * Knot editor
 */
class KnotEditor extends React.Component<Props, State> {

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
    this.loadKnot();    
  }

  /**
   * Component did update life-cycle event
   * 
   * @param prevProps previous props
   */
  public componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.knotId !== this.props.knotId) {
      this.loadKnot();
    }
  } 

  /**
   * Component render method
   */
  public render() {
    const tokenizerTypeOptions = [{
      key: TokenizerType.WHITESPACE,
      text: "Whitespace", // TODO: localize
      value: TokenizerType.WHITESPACE,
    }, {
      key: TokenizerType.UNTOKENIZED,
      text: "Untokenized", // TODO: localize
      value: TokenizerType.UNTOKENIZED,
    }];

    const knotTypeOptions = [{
      key: KnotType.TEXT,
      text: "Text", // TODO: Localize
      value: KnotType.TEXT
    }, {
      key: KnotType.IMAGE,
      text: "Image",  // TODO: Localize
      value: KnotType.IMAGE
    }];

    return (
      <Segment inverted style={{padding: "15px", paddingTop: "100px"}}>
        <Form inverted>
          <Form.Field>
            <label>Knot name</label>
            <Input value={ this.state.knotName } style={ { width: "100%" } } onChange={ this.onKnotNameChange } />
          </Form.Field>
          <Form.Field>
            <label>Knot type</label>
            <Dropdown onChange={ this.onKnotTypeChange } value={ this.state.knot ? this.state.knot.type : KnotType.TEXT } options={ knotTypeOptions } />
          </Form.Field>
          <Form.Field>
            <label>Knot contents</label>
            <TextArea rows={ 15 } style={ { width: "100%" } } onChange={ this.onKnotContentChange } value={ this.state.knotContent } />
          </Form.Field>       
          <Form.Field>
            <label>Knot hint</label>
            <Input value={ this.state.knotHint } style={ { width: "100%" } } onChange={ this.onKnotHintChange } />
          </Form.Field>   
          <Form.Field>
            <label>Tokenizer</label>
            <Dropdown onChange={ this.onTokenizerChange } value={ this.state.knot ? this.state.knot.tokenizer : TokenizerType.WHITESPACE } options={ tokenizerTypeOptions } />
          </Form.Field>
          {
            <Loader inline active={ this.state.loading }/>
          }
        </Form>
      </Segment>
    );
  }

  /**
   * Loads knot
   */
  private loadKnot = async () => {
    this.setState({loading: true});

    const knot = await Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "").findKnot(this.props.storyId, this.props.knotId);

    this.setState({
      loading: false,
      knot: knot,
      knotName: knot.name,
      knotContent: knot.content
    });
  }

  /**
   * Event handler for knot name change
   * 
   * @param event event
   * @param data data
   */
  private onKnotNameChange = async (event: any, data: InputOnChangeData) => {
    const { knot } = this.state;
    if (!knot || !data.value) {
      return;
    }

    const { storyId, knotId } = this.props;
    knot.name = data.value as string;
    
    this.setState({
      loading: true,
      knotName: knot.name
    });
    
    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      loading: false,
      knot: updatedKnot
    });
  }

  /**
   * Event handler for knot hint change
   * 
   * @param event event
   * @param data data
   */
  private onKnotHintChange = async (event: any, data: InputOnChangeData) => {
    const { knot } = this.state;
    if (!knot || !data.value) {
      return;
    }

    const { storyId, knotId } = this.props;
    knot.hint = data.value as string;
    
    this.setState({
      loading: true,
      knotHint: knot.hint
    });
    
    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      loading: false,
      knot: updatedKnot
    });
  }

  /**
   * Event handler for knot content change
   * 
   * @param event event
   * @param data data
   */
  private onKnotContentChange = async (event: any, data: TextAreaProps) => {
    const { knot } = this.state;
    if (!knot || !data.value) {
      return;
    }

    const { storyId, knotId } = this.props;
    knot.content = data.value as string;
    
    this.setState({
      loading: true,
      knotContent: knot.content
    });
    
    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      loading: false,
      knot: updatedKnot
    });
  }

  /**
   * Event handler for knot tokenizer change
   * 
   * @param event event
   * @param data data
   */
  private onTokenizerChange = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { knot } = this.state;
    if (!knot || !data.value) {
      return;
    }

    const { storyId, knotId } = this.props;
    knot.tokenizer = data.value as TokenizerType;
    
    this.setState({
      loading: true
    });
    
    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      loading: false,
      knot: updatedKnot
    });
  }

  /**
   * Event handler for knot type change
   * 
   * @param event event
   * @param data data
   */
  private onKnotTypeChange = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { knot } = this.state;
    if (!knot || !data.value) {
      return;
    }

    const { storyId, knotId } = this.props;
    knot.type = data.value as KnotType;
    
    this.setState({
      loading: true
    });
    
    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      loading: false,
      knot: updatedKnot
    });
  }

  private updateKnot = async (knot: Knot, storyId: string, knotId: string): Promise<Knot> => {
    const updatedKnot = await Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "").updateKnot(knot, storyId, knotId);
    this.props.onKnotUpdated(updatedKnot);
    return updatedKnot;
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
    onLogin: (keycloak: KeycloakInstance, authenticated: boolean) => dispatch(actions.userLogin(keycloak, authenticated)),
    onKnotUpdated: (knot: Knot) => dispatch(actions.knotUpdated(knot))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(KnotEditor);;