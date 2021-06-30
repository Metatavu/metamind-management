import * as React from "react";
import { useStoryPreviewViewStyles } from "./story-preview-view";
import { HomeNodeModel } from "../../diagram-components/home-node/home-node-model";
import { GlobalNodeModel} from "../../diagram-components/global-node/global-node-model";
import { Action, CanvasWidget, InputType } from '@projectstorm/react-canvas-core';
import { CustomNodeModel } from "../../diagram-components/custom-node/custom-node-model";
import { MessageData } from "metamind-metatavu-bot/src/types";
import { botOrUserResponse, messagesEndUpdate } from "metamind-metatavu-bot/src/actions";
import MessageList from "metamind-metatavu-bot/src/components/message-list/message-list"
import MessageInput from "metamind-metatavu-bot/src/components/message-input/message-input"
import { connect } from "react-redux";


/**
 * Interface describing component props
 */
interface Props {
  messageDatas: state.messageDatas
  conversationStarted: state.conversationStarted,
  messagesEnd: state.messagesEnd
}

/**
 * Functional story editor component
 *
 * @param props component properties
 */
const StoryPreviewView: React.FC<Props> = ({
}) => {
  const classes = useStoryPreviewViewStyles();

  /**
   * Component render
   */
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* <MessageList
        messageDatas={ messageDatas }
        messagesEnd={ messagesEnd }
        waitingForBot={ waitingForBot }
        conversationStarted={ conversationStarted } 
        quickResponses={ quickResponses }
        startConversation={ this.beginConversation }
        onSendMessage={ this.sendMessage }
        onReset={ this.resetBot }
        onWaitingForBotChange={ this.onWaitingForBotChange }
        userResponse={ botOrUserResponse }
        messagesEndUpdate={ messagesEndUpdate }
      />
      <MessageInput
        messagesEnd={ messagesEnd }
        waitingForBot={ waitingForBot }
        globalQuickResponses={ globalQuickResponses }
        hint={ hint || "Sano jotain..." }
        onSendMessage={ this.sendMessage }
        conversationStarted={ conversationStarted } 
        onReset={ this.resetBot }
        onRestartConversation={ this.restartConversation }
      /> */}
    </div>
  );
}

/**
 * Redux mapper for mapping store state to component properties
 * 
 * @param state store state
 */
const mapStateToProps = (state: StoreState) => ({
  messageDatas: state.messageDatas,
  conversationStarted: state.conversationStarted,
  messagesEnd: state.messagesEnd
});

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<actions.RootAction>) => ({
  botOrUserResponse: (messageData: MessageData) => dispatch(actions.botOrUserResponse(messageData)),
  startConversation: () => dispatch(actions.conversationStart()),
  onBotReset: () => dispatch(actions.BotReset()),
  onBotInterrupt: () => dispatch(actions.BotInterrupted()),
  onAccessTokenUpdate: (accessToken: AccessToken) => dispatch(actions.accessTokenUpdate(accessToken)),
  messagesEndUpdate: (messagesEnd?: HTMLDivElement) => dispatch(actions.messagesEndUpdate(messagesEnd))
});

export default connect(mapStateToProps, mapDispatchToProps)(StoryPreviewView);
