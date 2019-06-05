import * as Keycloak from "keycloak-js";
import { KeycloakInstance } from "keycloak-js";
import Api, { Story } from "metamind-client";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button,  ButtonProps, Dropdown, DropdownProps, Grid, Input, InputProps,  Loader,  Segment } from "semantic-ui-react";
import { IStoreState } from "src/types";
import * as actions from "../../actions";

const NEW_STORY_ID = "NEW";

/**
 * Component props
 */
interface IProps {
  authenticated: boolean;
  keycloak?: Keycloak.KeycloakInstance;
  onStorySelected: (storyId: string) => void;
}

/**
 * Component state
 */
interface IState {
  loading: boolean;
  stories: Story[];
  newStoryName?: string;
  selectedStoryId?: string;
}

/**
 * Story selector component
 */
class StorySelector extends React.Component<IProps, IState> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
      stories: [],
    };
  }

  /**
   * Component did mount life-cycle method
   */
  public componentDidMount = async () => {
    this.loadStories();
  }

  /**
   * Component render method
   */
  public render() {
    if (this.state.loading) {
      return <Loader/>;
    }

    const options = this.state.stories.map((story) => {
      return {
        key: story.id,
        text: story.name,
        value: story.id,
      };
    }).concat([
      {
        key: NEW_STORY_ID,
        text: "New", // TODO: localize,
        value: NEW_STORY_ID,
      },
    ]);

    return (
      <Segment inverted style={{padding: "15px", paddingTop: "100px"}} loading={this.state.loading}>
        <Grid>
          <Grid.Row>
            Select a story
          </Grid.Row>
          <Grid.Row>
            <Dropdown onChange={ this.onStorySelect } value={ this.state.selectedStoryId ? this.state.selectedStoryId : undefined } options={ options } />
          </Grid.Row>
          { this.renderStorySelector() }
          <Grid.Row>
            <Button onClick={ this.onSelectStoryClick } disabled={ !this.state.selectedStoryId && !this.state.newStoryName}>
              { this.state.selectedStoryId === NEW_STORY_ID ? "Create" : "Select" }
            </Button>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  /**
   * Renders story editor
   */
  private renderStorySelector() {
    if (NEW_STORY_ID !== this.state.selectedStoryId) {
      return null;
    }

    return (
      <Grid.Row>
        <Input onChange={ (event: any, data: InputProps ) => { this.setState({
          newStoryName: data.value as string || undefined,
        }); } }></Input>
      </Grid.Row>
    );
  }

  /**
   * Loads stories into state
   */
  private async loadStories() {
    this.setState({loading: true});
    const stories = await Api.getStoriesService(this.props.keycloak ? this.props.keycloak.token! : "").listStories();

    this.setState({
      loading: false,
      selectedStoryId: stories.length ? stories[0].id : undefined,
      stories,
    });
  }

  /**
   * Event handler for story select dropdown change
   *
   * @param event event
   * @param data data
   */
  private onStorySelect = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const storyId = data.value as string || undefined;

    this.setState({
      selectedStoryId: storyId,
    });
  }

  /**
   * Event handler for story select click
   *
   * @param event event
   * @param data data
   */
  private onSelectStoryClick = async (event: React.SyntheticEvent<HTMLElement, Event>, data: ButtonProps) => {
    if (this.state.newStoryName && this.state.selectedStoryId === NEW_STORY_ID) {
      const story = await Api.getStoriesService(this.props.keycloak ? this.props.keycloak.token! : "").createStory({
        locale: "fi",
        name: this.state.newStoryName,
      });

      this.props.onStorySelected(story.id!);
    } else if (this.state.selectedStoryId) {
      this.props.onStorySelected(this.state.selectedStoryId);
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

export default connect(mapStateToProps, mapDispatchToProps)(StorySelector);
