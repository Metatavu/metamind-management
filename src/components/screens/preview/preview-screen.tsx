import { Box, Drawer, Tabs, Tab } from "@material-ui/core";
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
import { StoryData } from "../../../constants/types"

/**
 * Interface describing component props
 */
interface Props {
  history: History;
  keycloak: KeycloakInstance;
  accessToken: AccessToken;
  storyId: string;
}

/**
 * Preview screen component
 */
const  PreviewScreen: React.FC<Props> = ({   
  accessToken,
  keycloak
}) => {
  const { storyId } = useParams<{ storyId: string }>();

  const classes = usePreviewStyles(); 
  const [ storyData, setStoryData ] = React.useState<StoryData>({});
  const { story, knots, selectedKnot, selectedIntent, intents, trainingMaterial } = storyData;

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  /**
   * Fetches knots list for the story
   */
  const fetchData = async () => {
    if (!accessToken) {
      return;
    }

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

  /**
   * Event handler for on knot click
   * 
   * @param knot knot
   */
  const onKnotClick = (knot: Knot) => {
    if (!knot?.coordinates?.x || !knot?.coordinates?.y) {
      return;
    }
    setStoryData({ ...storyData, selectedKnot: knot });
  }

  return (
    <AppLayout
      storySelected
      storyId={ storyId }
      keycloak={ keycloak }
      pageTitle={ storyData.story?.name ?? "" }
      dataChanged={ true }
    >
      { renderLeftToolbar() }
      <Box marginLeft="320px">
        {/* <MessageList /> */}
      </Box>
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
  keycloak: state.auth.keycloak as KeycloakInstance
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewScreen);
