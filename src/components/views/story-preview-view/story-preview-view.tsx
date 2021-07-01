import * as React from "react";
import { useStoryPreviewViewStyles } from "./story-preview-view";
import { MessageData } from "metamind-metatavu-bot/src/types";
import MessageList from "metamind-metatavu-bot/src/components/message-list/message-list"
import MessageInput from "metamind-metatavu-bot/src/components/message-input/message-input"
import { connect } from "react-redux";
import { ReduxActions, ReduxState } from "../../../store";
import { Dispatch } from "react";
import { botInterrupted, botOrUserResponse, botReset, conversationStart, messagesEndUpdate } from "../../../actions/bot";
import { StoryData } from "../../../constants/types";
import { Message } from "../../../generated/client";

/**
 * Interface describing component props
 */
interface Props {
  messageDatas: MessageData[];
  conversationStarted: boolean;
  messagesEnd?: HTMLDivElement;
  storyData?: StoryData;
  botOrUserResponse: (message: MessageData) => void;
  conversationStart: () => void;
  onBotReset: () => void;
  onBotInterrupt: () => void;
  messagesEndUpdate: (messageEnd?: HTMLDivElement) => void;
}

/**
 * Functional story editor component
 *
 * @param props component properties
 */
const StoryPreviewView: React.FC<Props> = ({
  messageDatas,
  conversationStarted,
  messagesEnd,
  storyData,
  botOrUserResponse,
  conversationStart,
  onBotReset,
  onBotInterrupt,
  messagesEndUpdate
}) => {
  const classes = useStoryPreviewViewStyles();
  const [ waitingForBot, setWaitingForBot ] = React.useState(false);
  const [ hint, setHint ] = React.useState("");
  const [ quickResponses, setQuickResponses ] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadData();
  }, [])

  /**
   * Sending new messages
   * 
   * @param message message content
   */
  const sendMessage = (message: string) => {
    // TODO
  }

  /**
   * Restart the converstation
   */
  const restartConversation = () => {
    // TODO
  }

  /**
   * Load the story
   */
  const loadData = async () => {
    // TODO
  }

  const globalQuickResponses: string[] = [];
  /**
   * Component render
   */
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MessageList
        messageDatas={ messageDatas }
        messagesEnd={ messagesEnd }
        waitingForBot={ waitingForBot }
        conversationStarted={ conversationStarted } 
        quickResponses={ quickResponses }
        startConversation={ conversationStart }
        onSendMessage={ sendMessage }
        onReset={ onBotReset }
        onWaitingForBotChange={ setWaitingForBot }
        userResponse={ botOrUserResponse }
        messagesEndUpdate={ messagesEndUpdate }
      />
      <MessageInput
        messagesEnd={ messagesEnd }
        waitingForBot={ waitingForBot }
        globalQuickResponses={ globalQuickResponses }
        hint={ hint || "Sano jotain..." }
        onSendMessage={ sendMessage }
        conversationStarted={ conversationStarted } 
        onReset={ onBotReset }
        onRestartConversation={ restartConversation }
      />
    </div>
  );
}

/**
 * Redux mapper for mapping store state to component properties
 * 
 * @param state store state
 */
const mapStateToProps = (state: ReduxState) => ({
  messageDatas: state.bot.messageDatas,
  conversationStarted: state.bot.conversationStarted,
  messagesEnd: state.bot.messagesEnd,
});

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: Dispatch<ReduxActions>) => ({
  botOrUserResponse: (messageData: MessageData) => dispatch(botOrUserResponse(messageData)),
  conversationStart: () => dispatch(conversationStart()),
  onBotReset: () => dispatch(botReset()),
  onBotInterrupt: () => dispatch(botInterrupted()),
  messagesEndUpdate: (messagesEnd?: HTMLDivElement) => dispatch(messagesEndUpdate(messagesEnd))
});

export default connect(mapStateToProps, mapDispatchToProps)(StoryPreviewView);
