import { Box, Drawer, Tabs, Tab, CircularProgress, Dialog, Divider } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { usePreviewStyles } from "./preview-screen.styles";
import { History } from "history";
import { KeycloakInstance } from 'keycloak-js';
import KnotPanel from "../../knot-components/knot-list/knot-list";
import { Story, Knot, Intent, TrainingMaterial } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import { Typography } from "@material-ui/core";
import Api from "../../../api/api";
import { useParams } from "react-router-dom";
import { StoryData } from "../../../types"
import { loadStory, setStoryData } from "../../../actions/story";
import StoryPreviewView from "../../views/story-preview-view";
import Loading from "../../generic/loading-item/loading-item";
import { MessageData } from "../../../../metamind-metatavu-bot/dist/types";

/**
 * Interface describing component props
 */
interface Props {
  keycloak?: KeycloakInstance;
  accessToken: AccessToken;
  storyData?: StoryData;
  storyLoading: boolean;
  loadStory: () => void;
  setStoryData: (storyData: StoryData) => void;
}

/**
 * Preview screen component
 */
const  PreviewScreen: React.FC<Props> = ({   
  accessToken,
  keycloak,
  storyData,
  storyLoading,
  loadStory,
  setStoryData
}) => {
  const { storyId } = useParams<{ storyId: string }>();
  const classes = usePreviewStyles();
  const [ messageDatas, setMessageDatas ] = React.useState<MessageData[]>([]);
  const [ conversationStarted, setConversationStarted ] = React.useState(false);
  const [ messagesEnd, setMessagesEnd ] = React.useState<HTMLDivElement | undefined>(undefined);

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  /**
   * Interrupt the bot before the bot response 
   */
  const botInterrupted = () => {
    setMessageDatas((messageDatas) =>
      messageDatas.filter(messageData => !messageData.id.startsWith("temp"))
    )
  }

  /**
   * Bot or user response 
   */
  const botOrUserResponse = (message: MessageData) => {
    setMessageDatas((messageDatas) => [
      ...messageDatas.filter(messageData => !messageData.id.startsWith("temp")), 
      message
    ])
  }

  /**
   * Start the conversation 
   */
  const conversationStart = () => {
    setConversationStarted((conversationStarted) => true)
  }

  /**
   * Bot reset 
   */
  const botReset = () => {
    setMessageDatas((messageDatas) => []);
    setConversationStarted((conversationStarted) => false);
  }

  /**
   * Update the message end 
   */
    const messagesEndUpdate = (messagesEnd?: HTMLDivElement) => {
      setMessagesEnd((messageEndPrev) => messagesEnd);
    }

  /**
   * Fetches knots list for the story
   */
  const fetchData = async () => {
    if (!accessToken) {
      return;
    }

    if (!storyLoading && storyData && storyData.story?.id === storyId){
      return;
    }

    loadStory();

    const [ story, knotList, intentList, trainingMaterialList ] = await Promise.all([
      Api.getStoriesApi(accessToken).findStory({ storyId }),
      Api.getKnotsApi(accessToken).listKnots({ storyId }),
      Api.getIntentsApi(accessToken).listIntents({ storyId }),
      Api.getTrainingMaterialApi(accessToken).listTrainingMaterials({ storyId })
    ]);

    setStoryData({
      story: story,
      knots: knotList,
      intents: intentList,
      trainingMaterial: trainingMaterialList
    });
  }

  /**
   * Renders loading
   */
  const renderLoading = () => {
    return (

      <Box style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", display: "flex" }}>
        <Loading text={ strings.loading.loadingStory }/>
      </Box>
    );
  }

  /**
   * Renders left toolbar
   */
  const renderLeftToolbar = () => {
    return (
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar/>
        <Box height="49px" display="flex" borderBottom={1}>
          <Box margin="auto">
            <Typography component="h3">
              { strings.previewScreen.leftBar.knotsLeftTab }
            </Typography>
          </Box>
        </Box>
        <Box>
          <KnotPanel 
            knots={ knots ?? [] }
            onKnotClick={ onKnotClick }
          />
        </Box>
      </Drawer>
    );
  }

  const renderPreviewContent = () => {
    if (!knots || !intents) {
      return;
    }

    return (
      // TODO fix the absolute margin
      <Box
        marginLeft="320px"
        height="100%"
      >
        <Toolbar/>
        <Box className={ classes.previewContainer }>
          <StoryPreviewView
            storyData={ storyData }
            messageDatas={ messageDatas }
            conversationStarted={ conversationStarted }
            messagesEnd={ messagesEnd }
            botOrUserResponse={ botOrUserResponse }
            botInterrupted={ botInterrupted }
            conversationStart={ conversationStart }
            botReset={ botReset }
            messagesEndUpdate={ messagesEndUpdate }
          />
        </Box>
      </Box>
    );
  }

  /**
   * Event handler for on knot click
   * 
   * @param knot knot
   */
  const onKnotClick = (knot: Knot) => {
    // TODO make bot responsive
    if (!knot?.coordinates?.x || !knot?.coordinates?.y) {
      return;
    }
    setStoryData({ ...storyData, selectedKnot: knot });
  }


  if (!keycloak) {
    return null;
  }

  if (storyLoading || !storyData) {
    return (
      <AppLayout
      keycloak={ keycloak }
      pageTitle={ strings.loading.loading }
    >
      { renderLoading() }
    </AppLayout>
    );
  }

  const { story, knots, selectedKnot, selectedIntent, intents, trainingMaterial } = storyData;

  return (
    <AppLayout
      keycloak={ keycloak }
      pageTitle={ storyData.story?.name ?? "" }
      dataChanged={ true }
    >
      { renderLeftToolbar() }
      { renderPreviewContent() }
    </AppLayout>
  );
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
  storyData: state.story.storyData,
  storyLoading: state.story.storyLoading,
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({
  loadStory: () => dispatch(loadStory()),
  setStoryData: (storyData: StoryData) => dispatch(setStoryData(storyData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewScreen);
