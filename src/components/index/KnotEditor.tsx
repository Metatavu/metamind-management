import * as Keycloak from "keycloak-js";
import { KeycloakInstance } from "keycloak-js";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IStoreState } from "src/types";
import * as actions from "../../actions";

import Api, { Knot, KnotType, TokenizerType } from "metamind-client";
import { Dropdown, DropdownProps, Form, Input, InputOnChangeData, Loader, Segment, TextArea, TextAreaProps } from "semantic-ui-react";

/**
 * Component props
 */
interface IProps {
  storyId: string;
  knotId: string;
  authenticated: boolean;
  keycloak?: Keycloak.KeycloakInstance;
  onKnotUpdated: (knot: Knot) => void;
}

/**
 * Component state
 */
interface IState {
  loading: boolean;
  knot?: Knot;
  knotName?: string;
  knotContent?: string;
  knotHint?: string;
}

/**
 * Knot editor
 */
class KnotEditor extends React.Component<IProps, IState> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  /**
   * Component did mount life-cycle event
   */
  public componentDidMount = async () => {
    this.loadKnot();
  }

  /**
   * Component did update life-cycle event
   *
   * @param prevProps previous props
   */
  public componentDidUpdate = async (prevProps: IProps) => {
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
      value: KnotType.TEXT,
    }, {
      key: KnotType.IMAGE,
      text: "Image",  // TODO: Localize
      value: KnotType.IMAGE,
    }];

    return (
      <Segment inverted style={{padding: "15px", paddingTop: "100px"}}>
        <Form inverted>
          <Form.Field>
            <label>Knot name</label>
            <Input
            value={ this.state.knotName }
            style={ { width: "100%" } }
            onChange={ this.onKnotNameChange } />
          </Form.Field>
          <Form.Field>
            <label>Knot type</label>
            <Dropdown
            onChange={ this.onKnotTypeChange }
            value={ this.state.knot ? this.state.knot.type : KnotType.TEXT }
            options={ knotTypeOptions } />
          </Form.Field>
          <Form.Field>
            <label>Knot contents</label>
            {
              this.state.knot && this.state.knot.type === KnotType.IMAGE ?
              <img
              src={`${process.env.REACT_APP_API_BASE_PATH}/images/${this.state.knotContent}`}
              style={ { width: "100%" } }
              />
              :
              <TextArea
              rows={ 15 }
              style={ { width: "100%" } }
              onChange={ this.onTextKnotContentChange }
              value={ this.state.knotContent } />
            }

          </Form.Field>
          {
            this.state.knot && this.state.knot.type === KnotType.IMAGE ?
            <Form.Field>
            <label>Change image</label>
            <input
            type="file"
            onChange= { this.onImageKnotContentChange }
            />
            </Form.Field> :
            <div></div>
          }

          <Form.Field>
            <label>Knot hint</label>
            <Input
            value={ this.state.knotHint }
            style={ { width: "100%" } }
            onChange={ this.onKnotHintChange } />
          </Form.Field>
          <Form.Field>
            <label>Tokenizer</label>
            <Dropdown
            onChange={ this.onTokenizerChange }
            value={ this.state.knot ? this.state.knot.tokenizer : TokenizerType.WHITESPACE } options={ tokenizerTypeOptions } />
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
      knot,
      knotContent: knot.content,
      knotName: knot.name,
      loading: false,

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
      knotName: knot.name,
      loading: true,

    });

    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      knot: updatedKnot,
      loading: false,

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
      knotHint: knot.hint,
      loading: true,

    });

    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      knot: updatedKnot,
      loading: false,

    });
  }

  /**
   * Event handler for text knot content change
   *
   * @param event event
   * @param data data
   */
  private onTextKnotContentChange = async (event: any, data: TextAreaProps) => {
    const { knot } = this.state;
    if (!knot || !data.value) {
      return;
    }

    const { storyId, knotId } = this.props;
    knot.content = data.value as string;

    this.setState({
      knotContent: knot.content,
      loading: true,

    });

    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      knot: updatedKnot,
      loading: false,

    });
  }

  /**
   * Event handler for image knot content change
   * @param event event
   */
  private onImageKnotContentChange = async (event: any) => {
    const { knot } = this.state;
    if (!knot || !event.currentTarget.files[0]) {
      return;
    }

    const { knotId, storyId } = this.props;

    this.setState({
      loading: true,
    });

    const formData = new FormData();
    formData.append("file", event.currentTarget.files[0]);
    formData.append("knotId", knotId);
    const options = {
      body: formData,
      method: "put",
    };

    await fetch(`${process.env.REACT_APP_API_BASE_PATH}/images`, options).then( (response) => response.json() ).then( (data) => {
      knot.content = data.filename;
      this.setState({
        knot,
        knotContent: knot.content,
        loading: true,
      });
      return this.updateKnot(knot, storyId, knotId);
    }).then( (updatedKnot) => {
      this.setState({
        knot: updatedKnot,
        loading: false,
      });
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
      loading: true,
    });

    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      knot: updatedKnot,
      loading: false,

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
    if ( knot.type === KnotType.IMAGE && data.value as KnotType === KnotType.TEXT  ) {
      fetch(`${process.env.REACT_APP_API_BASE_PATH}/images/${knot.content}`, {method: "delete"});
    }
    const { storyId, knotId } = this.props;
    knot.type = data.value as KnotType;
    this.setState({
      loading: true,
    });

    const updatedKnot = await this.updateKnot(knot, storyId, knotId);

    this.setState({
      knot: updatedKnot,
      loading: false,
    });
  }

  private updateKnot = async (knot: Knot, storyId: string, knotId: string): Promise<Knot> => {
    const updatedKnot = await Api.getKnotsService(this.props.keycloak ? this.props.keycloak.token! : "").updateKnot(knot, storyId, knotId);
    this.props.onKnotUpdated(updatedKnot);
    return updatedKnot;
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
    onKnotUpdated: (knot: Knot) => dispatch(actions.knotUpdated(knot)),
    onLogin: (keycloak: KeycloakInstance, authenticated: boolean) => dispatch(actions.userLogin(keycloak, authenticated)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(KnotEditor);
