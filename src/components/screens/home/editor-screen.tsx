import * as React from "react";

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ReduxActions, ReduxState } from "../../../store";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import { styles } from "./editor-screen.styles";
import { KeycloakInstance } from "keycloak-js";
import AppLayout from "../../layouts/app-layout/app-layout";
import { AccessToken } from "../../../types";
import { Box, List, ListItem, ListItemIcon, WithStyles, withStyles, Drawer, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import { Knot } from "../../../generated/client/models/Knot";
import { KnotType } from "../../../generated/client/models/KnotType";
import { TokenizerType } from "../../../generated/client/models/TokenizerType";
import { Story } from "../../../generated/client/models/Story";
import strings from "../../../localization/strings";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import Api from "../../../api/api";
import { access } from "fs";
import { Intent } from '../../../generated/client/models/Intent';
import { IntentType } from '../../../generated/client/models/IntentType';
import { IntentsApi, CreateIntentRequest } from '../../../generated/client/apis/IntentsApi';


/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  keycloak: KeycloakInstance;
  accessToken: AccessToken;
}

/**
 * Interface describing component state
 */
interface State {
  error?: Error;
  leftToolbarIndex: number;
  rightToolbarIndex: number;
  storyKnots: Knot[];
  storyIntents: Intent[];
  currentKnot?: Knot;
  currentStory?: Story;
  storyId?: String;
}

/**
 * Editor screen component
 */
class EditorScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      leftToolbarIndex: 0,
      rightToolbarIndex: 0,
      storyKnots: [],
      storyIntents: []
    };
  }

  /**
   * Component render
   */
  public render = () => {
    return (
      <AppLayout>
        { this.renderLeftToolbar() }
        { this.renderContent() }
        { this.renderRightToolbar() }
      </AppLayout>
    );
  }

  /**
   * Renders left toolbar
   */
  private renderLeftToolbar = () => {
    const { leftToolbarIndex } = this.state;

    return (
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar/>
        <Tabs
          onChange={ this.setLeftTabIndex }
          value={ leftToolbarIndex }
        >
          <Tab
            fullWidth
            value={ 0 }
            label={ strings.editorScreen.leftBar.knotsLeftTab }
          />
          <Tab
            fullWidth
            value={ 1 }
            label={ strings.editorScreen.leftBar.intentsLeftTab }
          />
        </Tabs>
        <Box>
          { leftToolbarIndex === 0 && this.renderKnotsTab() }
          { leftToolbarIndex === 1 && this.renderIntentsTab() }
        </Box>
      </Drawer>
    );
  }

  /**
   * Renders main content area
   * Todo: make correct margins from top and side panels
   */
  private renderContent = () => {
    return (
      <Box height="100%"/>
    );
  }

  /**
   * Renders right toolbar
   */
  private renderRightToolbar = () => {
    const { rightToolbarIndex } = this.state;

    return (
      <Drawer
        variant="permanent"
        anchor="right"
      >
        <Toolbar/>
        <Tabs
          onChange={ this.setRightTabIndex }
          value={ rightToolbarIndex } 
        >
          <Tab
            value={ 0 }
            label={ strings.editorScreen.rightBar.storyRightTab }
          />
          <Tab
            value={ 1 }
            label={ strings.editorScreen.rightBar.detailsRightTab }
          />
          <Tab
            value={ 2 }
            label={ strings.editorScreen.rightBar.linkingRightTab }
          />
        </Tabs>
        <Box p={ 2 }>
          { rightToolbarIndex === 0 && this.renderStoryTab() }
          { rightToolbarIndex === 1 && this.renderDetailsTab() }
          { rightToolbarIndex === 2 && this.renderLinkingTab() }
        </Box>
      </Drawer>
    );
  }

  /**
   * Sets left tab index
   * 
   * @param event event object
   * @param newValue new tab index value
   */
  private setLeftTabIndex = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({
      leftToolbarIndex: newValue
    });
  }

  /**
   * Sets right tab index
   * 
   * @param event event object
   * @param newValue new tab index value
   */
  private setRightTabIndex = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({
      rightToolbarIndex: newValue
    });
  }

  /**
   * Renders story tab of right toolbar
   */
  private renderStoryTab = () => {
    const { currentStory } = this.state;

    return (
      <TextField
        label={ strings.editorScreen.rightBar.storyNameHelper }
        defaultValue={ currentStory?.name }
      />
    );
  }

  /**
   * Renders details tab if global knot is selected  
   */
  private renderDetailsTab = () => {
    const { currentKnot } = this.state;

    return (   
      <Box>
        <TextField
          label={ strings.editorScreen.rightBar.knotNameHelper }
          defaultValue={ currentKnot?.name }
        />
        <Divider/>
        { this.renderKnotDetails(currentKnot?.name) }
      </Box>
    )
  }

  /**
   * Renders detailed tab of knot details
   * 
   * @param currentKnot current knot
   */
  private renderKnotDetails = (currentKnot?: String) => {
    return null;
  }

  /**
   * Renders right toolbar linking tab
   */
  private renderLinkingTab = () => {
    return null;
  }

  /**
   * Renders tab of knots (left toolbar)
   * 
   * Todo dropdown list
   */
  private renderKnotsTab = () => {
    const { storyKnots } = this.state;

    const globalKnot = storyKnots[0];
    return (
      <Box>
        <Box p={ 2 }>
          <TextField 
            fullWidth
            label={ strings.editorScreen.leftBar.knotSearchHelper }
          />
        </Box>
        <Divider/>
        {
          <Box>
          <Typography>Global knots</Typography>
          <ListItem button>
            <ListItemIcon>
              <TagFacesIcon/>
            </ListItemIcon>
            <ListItemText>
              { globalKnot?.name }
            </ListItemText>
          </ListItem>        
          </Box>  
        }
        <Divider/>                   
          <Box>
            <Typography>Basic knots</Typography>
            <List>
              {storyKnots?.map(knot => (
                <ListItem button>
                  <ListItemIcon>
                    <TagFacesIcon/>
                  </ListItemIcon>
                  <ListItemText>
                    { knot.name }
                  </ListItemText>
                </ListItem>
              ))
              }
            </List>
          </Box>    
      </Box>
    );
  }

  /*
  * Renders tab of intents (left toolbar)
  */
  private renderIntentsTab = () => {
    const { storyIntents } = this.state;

    const normalIntents = storyIntents.filter(intent => intent.type === IntentType.NORMAL)
    const defaultIntents = storyIntents.filter(intent => intent.type === IntentType.DEFAULT)
    const confusedIntents = storyIntents.filter(intent => intent.type === IntentType.CONFUSED)
    const redirectIntents = storyIntents.filter(intent => intent.type === IntentType.REDIRECT)

    return (
      <Box>
        <Box p={ 2 }>
          <TextField 
            fullWidth
            label={ strings.editorScreen.leftBar.intentSearchHelper }
          />
        </Box>
        <Divider/>                   
          <Box>
            <Typography>Normal intents</Typography>      
            { this.renderIntentsGroup(normalIntents) }      
          </Box>
        <Divider/>
          <Box>
            <Typography>Default intents</Typography>       
            { this.renderIntentsGroup(defaultIntents) }  
          </Box>
        <Divider/>
          <Box>
            <Typography>Confused intents</Typography>  
            { this.renderIntentsGroup(confusedIntents) }  
          </Box>
        <Divider/>
          <Box>
            <Typography>Redirect intents</Typography>  
            { this.renderIntentsGroup(redirectIntents) }                
          </Box>
      </Box>
    );
  }

  /**
   * Renders list of intents for left toolbar second tab
   * 
   * @param intents list of intents from one group
   */
  private renderIntentsGroup = (intents : Intent[]) => {
    return (
      <List>
        {intents.map(intent => (
        <ListItem button>
          <ListItemIcon>
            <TagFacesIcon/>
          </ListItemIcon>
          <ListItemText>
            { intent.name }
          </ListItemText>
          </ListItem>
          ))
          }
      </List>
    )
  }

  /**
   * Fetches knots list for the story
   */
  private fetchData = async() => {
    console.log("fetching test data")
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    const storiesApi = Api.getStoriesApi(accessToken)
    const knotsApi = Api.getKnotsApi(accessToken)
    const intentsApi = Api.getIntentsApi(accessToken)

    const [ stories ] = await Promise.all<Story[]>([
      storiesApi.listStories()
    ]);  
    let mainStoryId: string = stories[0].id as string;
    const foundStory = await storiesApi.findStory({storyId: mainStoryId})
    if (foundStory) {
      let foundStoryId: string = foundStory.id as string;
      const [ knotList ] = await Promise.all<Knot[]>([
        knotsApi.listKnots({
          storyId: foundStoryId
        })
      ]);  

      const [ intentList ] = await Promise.all<Intent[]>([
        intentsApi.listIntents({
          storyId: foundStoryId
        })
      ]);  

      this.setState({
        currentStory: foundStory,
        storyKnots : knotList,
        storyIntents: intentList
      });
    }
  }


    /**
   * Component did mount life cycle handler
   */
  public componentDidMount = () => {
    //this.clearTestData()
    //this.createTestData()
    this.fetchData();
  }

  /**
   * Clears all test data
   */
  private clearTestData = async() => {
    console.log("cleaning test data")
    const { accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    const storiesApi = Api.getStoriesApi(accessToken)
    const knotsApi = Api.getKnotsApi(accessToken)
    const intentsApi = Api.getIntentsApi(accessToken)
    
    const [ allStories ] = await Promise.all<Story[]>([
      storiesApi.listStories()
    ]);

    for (let story of allStories) {
      let storyId: string = story.id as string;
      //remove all knots
      const [ allKnots ] = await Promise.all<Knot[]>([
        knotsApi.listKnots({
            storyId: storyId
          })
      ]);
      for (let knot of allKnots) {
        let knotId: string = knot.id as string;
        knotsApi.deleteKnot(
          {
            storyId: storyId,
            knotId: knotId
          }
        )
      }

      //remove all intents
      const [ allIntents ] = await Promise.all<Intent[]>([
        intentsApi.listIntents({
            storyId: storyId
          })
      ]);
      for (let intent of allIntents) {
        let intentId: string = intent.id as string;
        intentsApi.deleteIntent(
          {
            storyId: storyId,
            intentId: intentId
          }
        )
      }
    }
  }

    /**
   * Creates test story and knots for it
   */
    private createTestData = async() => {
      const { accessToken } = this.props;
  
      if (!accessToken) {
        return;
      }
      const storiesApi = Api.getStoriesApi(accessToken)
      const knotsApi = Api.getKnotsApi(accessToken)
      const intentsApi = Api.getIntentsApi(accessToken)
    
      const basicKnot0: Knot = {
        name: "basic0",
        type: KnotType.TEXT,
        tokenizer: TokenizerType.UNTOKENIZED,
        content: "basic knot 1 text content"
      };
  
      const basicKnot1: Knot = {
        name: "basic1",
        type: KnotType.TEXT,
        tokenizer: TokenizerType.UNTOKENIZED,
        content: "basic knot 2 text content"
      };
  
      const globalKnot0: Knot = {
        name: "global0",
        type: KnotType.TEXT,
        tokenizer: TokenizerType.UNTOKENIZED,
        content: "global knot 1 text content"
      };
  
      const globalKnot1: Knot = {
        name: "global1",
        type: KnotType.TEXT,
        tokenizer: TokenizerType.UNTOKENIZED,
        content: "global knot 1 text content"
      };
  
      const story0: Story = {
        name: "story 1",
        locale: "en"
      }; 
  
      const createdStory = await storiesApi.createStory({story: story0})

      const knot1 = await knotsApi.createKnot({knot: basicKnot0, storyId: createdStory.id!})
      const knot2 = await knotsApi.createKnot({knot: basicKnot1, storyId: createdStory.id!})
      const knot3 = await knotsApi.createKnot({knot: globalKnot0, storyId: createdStory.id!})
      const knot4 = await knotsApi.createKnot({knot: globalKnot1, storyId: createdStory.id!})
  }
}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 * @returns state from props
 */
const mapStateToProps = (state: ReduxState) => ({
  accessToken: state.auth.accessToken as AccessToken,
  keycloak: state.auth.keycloak as KeycloakInstance,
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditorScreen));
