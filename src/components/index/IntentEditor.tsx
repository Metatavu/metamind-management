import * as React from "react";
import * as Keycloak from 'keycloak-js';
import * as actions from "../../actions";
import { StoreState } from "src/types";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { KeycloakInstance } from "keycloak-js";

import Api, { Intent, TrainingMaterial } from "metamind-client";
import { Segment, Dropdown, DropdownProps, TextArea, Button, Grid, TextAreaProps } from "semantic-ui-react";


interface Props {
  storyId: string,
  intentId: string,
  authenticated: boolean,
  keycloak?: Keycloak.KeycloakInstance
}

interface State {
  loading: boolean,
  intent?: Intent,
  selectedTrainingMaterialId?: string,
  trainingMaterialText?: string,
  trainingMaterial?: TrainingMaterial
  trainingMaterials: TrainingMaterial[]
}

const NEW_TRAINING_MATERIAL_ID = "NEW";

class IntentEditor extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      trainingMaterials: [],
      loading: false
    };
  }

  public componentDidMount = async() => {
    this.loadIntent();    
  }

  public componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.intentId !== this.props.intentId) {
      this.loadIntent();
    }
  } 

  public render() {

    const trainingMaterialOptions = this.state.trainingMaterials.map((trainingMaterial) => {
      return {
        key: trainingMaterial.id,
        text: trainingMaterial.name,
        value: trainingMaterial.id
      }
    }).concat([
      {
        key: "NONE",
        text: "None", //TODO: localize,
        value: undefined
      }, {
        key: "NEW",
        text: "New", //TODO: localize,
        value: NEW_TRAINING_MATERIAL_ID
      }
    ]);

    return (
      <Segment inverted style={{padding: "15px", paddingTop: "100px"}} loading={this.state.loading}>
        <Grid>
          <Grid.Row>
            <Dropdown onChange={this.onTrainingMaterialSelect} value={this.state.trainingMaterial ? this.state.trainingMaterial.id : undefined} options={trainingMaterialOptions} />
          </Grid.Row>
          <Grid.Row>
            <TextArea onChange={(event: any, data: TextAreaProps) => this.setState({trainingMaterialText: data.value as string})} value={this.state.trainingMaterialText} />
          </Grid.Row>
          <Grid.Row>
            <Button onClick={this.updateTrainingMaterial}>Save</Button>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private async loadIntent() {
    this.setState({loading: true});

    const intent = await Api.getIntentsService("not-real-token").findIntent(this.props.storyId, this.props.intentId);
    const trainingMaterialService = await Api.getTrainingMaterialsService("not-a-real-token");
    const trainingMaterial = intent.trainingMaterialId ? await trainingMaterialService.findTrainingMaterial(intent.trainingMaterialId) : undefined;
    const trainingMaterials = await trainingMaterialService.listTrainingMaterials();

    this.setState({
      loading: false,
      intent: intent,
      trainingMaterial: trainingMaterial,
      selectedTrainingMaterialId: intent.trainingMaterialId,
      trainingMaterials: trainingMaterials,
      trainingMaterialText: trainingMaterial ? trainingMaterial.text : ""
    });
  }

  private updateTrainingMaterial = async () => {
    const { storyId, intentId } = this.props;
    const { selectedTrainingMaterialId, trainingMaterialText, intent } = this.state;

    if (!intent) {
      return;
    }

    this.setState({loading: true});
    let { trainingMaterial } = this.state; 
    const trainingMaterialService = Api.getTrainingMaterialsService("not-a-real-token");
    if (selectedTrainingMaterialId === NEW_TRAINING_MATERIAL_ID) {
      trainingMaterial = await trainingMaterialService.createTrainingMaterial({
        name: "TODO: name",
        storyId: storyId,
        text: trainingMaterialText || ""
      });
      intent.trainingMaterialId = trainingMaterial.id;
      await Api.getIntentsService("not-a-real-token").updateIntent(intent, storyId, intentId);
    } else if (trainingMaterial) {
      trainingMaterial = await trainingMaterialService.updateTrainingMaterial({
        name: "TODO: name",
        storyId: storyId,
        text: trainingMaterialText || ""
      }, trainingMaterial.id!);
    }

    this.setState({
      loading: false,
      selectedTrainingMaterialId: trainingMaterial ? trainingMaterial.id : undefined
    });

  }

  private onTrainingMaterialSelect = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { intent } = this.state;
    if (!intent) {
      return;
    }

    const trainingMaterialId = data.value as string || undefined;

    const { storyId, intentId } = this.props;
    intent.trainingMaterialId = trainingMaterialId === NEW_TRAINING_MATERIAL_ID ? undefined : trainingMaterialId;
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