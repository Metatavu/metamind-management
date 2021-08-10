import { Box, Drawer, Typography } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../../store";
import { AccessToken, StoryData } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import usePreviewStyles from "./preview-screen.styles";
import { KeycloakInstance } from "keycloak-js";
import strings from "../../../localization/strings";
import KnotPanel from "../../knot-components/knot-list/knot-list";
import { Knot } from "../../../generated/client/models";
import Api from "../../../api/api";
import { useParams } from "react-router-dom";
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
  locale: string;
  storyLoading: boolean;
  onLoadStory: typeof loadStory;
  onSetStoryData: typeof setStoryData;
}

/**
 * Preview screen component
 *  
 * @param props component properties
 */
const PreviewScreen: React.FC<Props> = ({
  accessToken,
  keycloak,
  storyData,
  storyLoading,
  onLoadStory,
  onSetStoryData
}) => {
  const { storyId } = useParams<{ storyId: string }>();
  const classes = usePreviewStyles();
  const [ messageData, setMessageData ] = React.useState<MessageData[]>([]);
  const [ conversationStarted, setConversationStarted ] = React.useState(false);
  const [ messagesEnd, setMessagesEnd ] = React.useState<HTMLDivElement>();

  if (!storyData) {
    return null;
  }

  const { knots, intents } = storyData;

  /**
   * Interrupt the bot before the bot response 
   */
  const botInterrupted = () => {
    setMessageData(prevMessageData => prevMessageData.filter(data => !data.id.startsWith("temp")));
  };

  /**
   * Bot or user response 
   */
  const botOrUserResponse = (message: MessageData) => {
    setMessageData(prevMessageData => [
      ...prevMessageData.filter(data => !data.id.startsWith("temp")),
      message
    ]);
  };

  /**
   * Start the conversation 
   */
  const conversationStart = () => {
    setConversationStarted(true);
  };

  /**
   * Bot reset
   */
  const botReset = () => {
    setMessageData([]);
    setConversationStarted(false);
  };

  /**
   * Update the message end 
   * 
   * @param end message end
   */
  const messagesEndUpdate = (end?: HTMLDivElement) => {
    setMessagesEnd(end);
  };

  /**
   * Fetches knots list for the story
   */
  const fetchData = async () => {
    if (!accessToken) {
      return;
    }

    if (!storyLoading && storyData?.story?.id === storyId) {
      return;
    }

    onLoadStory();

    const [ story, knotList, intentList, trainingMaterialList ] = await Promise.all([
      Api.getStoriesApi(accessToken).findStory({ storyId: storyId }),
      Api.getKnotsApi(accessToken).listKnots({ storyId: storyId }),
      Api.getIntentsApi(accessToken).listIntents({ storyId: storyId }),
      Api.getTrainingMaterialApi(accessToken).listTrainingMaterials({ storyId: storyId })
    ]);

    onSetStoryData({
      story: story,
      knots: knotList,
      intents: intentList,
      trainingMaterial: trainingMaterialList
    });
  };

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

    onSetStoryData({ ...storyData, selectedKnot: knot });
  };

  /**
   * Renders loading
   */
  const renderLoading = () => {
    return (
      <Box className={ classes.loadingContainer }>
        <Loading text={ strings.loading.loadingStory }/>
      </Box>
    );
  };

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
        <Box height="49px" display="flex" borderBottom={ 1 }>
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
            onKnotSecondaryClick={ onKnotClick }
          />
        </Box>
      </Drawer>
    );
  };

  /**
   * Renders preview content
   */
  /**
   * Renders preview content
   */
  const renderPreviewContent = () => {
    if (!knots || !intents) {
      return null;
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
            messageData={ messageData }
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
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (!keycloak) {
    return null;
  }

  if (storyLoading || !storyData) {
    return (
      <AppLayout
        keycloak={ keycloak }
        pageTitle={ strings.loading.loading }
        storySelected={ false }
      >
        { renderLoading() }
      </AppLayout>
    );
  }

  return (
    <AppLayout
      keycloak={ keycloak }
      pageTitle={ storyData.story?.name ?? "" }
      dataChanged={ true }
      storySelected={ true }
    >
      { renderLeftToolbar() }
      { renderPreviewContent() }
    </AppLayout>
  );
};

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 * @returns state from props
 */
const mapStateToProps = (state: ReduxState) => ({
  accessToken: state.auth.accessToken as AccessToken,
  keycloak: state.auth.keycloak as KeycloakInstance,
  locale: state.locale.locale,
  storyData: state.story.storyData,
  storyLoading: state.story.storyLoading
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({
  onLoadStory: () => dispatch(loadStory()),
  onSetStoryData: (storyData: StoryData) => dispatch(setStoryData(storyData))
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewScreen);