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
import { Box, List, ListItem, ListItemIcon, Typography, WithStyles, withStyles, Drawer, Tab, Tabs, TextField } from "@material-ui/core";
import { Knot } from "../../../generated/client/models/Knot";
import { KnotType } from "../../../generated/client/models/KnotType";
import { TokenizerType } from "../../../generated/client/models/TokenizerType";
import { Story } from "../../../generated/client/models/Story";
import strings from "../../../localization/strings";
import TagFacesIcon from "@material-ui/icons/TagFaces";

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
  basicKnots?: Knot[];
  globalKnots: Knot[];
  leftToolbarIndex: number;
  rightToolbarIndex: number;
  currentKnot: Knot;
  currentStory: Story;
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

    this.state = {
      basicKnots: [ basicKnot0, basicKnot1 ],
      globalKnots: [ globalKnot0, globalKnot1 ],
      leftToolbarIndex: 0,
      rightToolbarIndex: 0,
      currentStory: story0,
      currentKnot: globalKnot0
    };
  }

  /**
   * Component render
   */
  public render = () => {
    const { classes } = this.props;

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
    const { classes } = this.props;
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
    const { classes } = this.props;

    return (
      <Box bgcolor="success.main" height="100%"/>
    );
  }

  /**
   * Renders right toolbar
   */
  private renderRightToolbar = () => {
    const { classes } = this.props;
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
        <Box>
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
        defaultValue={ currentStory.name }>
      </TextField>
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
          defaultValue={ currentKnot.name }
        />
        <Divider/>
        { this.renderKnotDetails(currentKnot.name) }
      </Box>
    )
  }

  /**
   * Renders detailed tab of knot details
   * 
   * @param currentKnot current knot
   */
  private renderKnotDetails = (currentKnot: String) => {
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
    const { basicKnots, globalKnots } = this.state;

    return (
      <Box>
        <Box p={ 2 }>
          <TextField 
            fullWidth
            label={ strings.editorScreen.leftBar.knotSearchHelper }
          />
        </Box>
        <Divider/>
        { globalKnots &&
          globalKnots.map(knot => (
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
        <Divider/>
        <List>
          { basicKnots &&
            basicKnots.map(knot => (
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
    );
  }

  /*
  * Renders tab of intents (left toobar)
  */
  private renderIntentsTab = () => {
    return null;
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
