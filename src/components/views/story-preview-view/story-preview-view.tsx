import * as React from "react";
import useStoryPreviewViewStyles from "./story-preview-view";
import { MessageData } from "metamind-metatavu-bot/dist/types";
import MessageList from "metamind-metatavu-bot/dist/components/message-list/message-list";
import MessageInput from "metamind-metatavu-bot/dist/components/message-input/message-input";
import { StoryData } from "../../../types/index";
import { Box } from "@material-ui/core";

/**
 * Interface describing component props
 */
interface Props {
  messageData: MessageData[];
  conversationStarted: boolean;
  messagesEnd?: HTMLDivElement;
  storyData?: StoryData;
  botOrUserResponse: (message: MessageData) => void;
  conversationStart: () => void;
  botReset: () => void;
  botInterrupted: () => void;
  messagesEndUpdate: (messageEnd?: HTMLDivElement) => void;
}

/**
 * Functional story editor component
 *
 * @param props component properties
 */
const StoryPreviewView: React.FC<Props> = ({
  messageData,
  conversationStarted,
  messagesEnd,
  botOrUserResponse,
  conversationStart,
  botReset,
  messagesEndUpdate
}) => {
  const classes = useStoryPreviewViewStyles();
  const [ waitingForBot, setWaitingForBot ] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ hint, setHint ] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ quickResponses, setQuickResponses ] = React.useState<string[]>([]);

  /**
   * Restart the converstation
   */
  const restartConversation = () => {
    // TODO 
  };

  /**
   * Load the story
   */
  const loadData = () => {
    if (messageData.length) {
      return;
    }
    
    // TODO load the actual data
    botOrUserResponse({
      content: "INIT",
      id: "5b097404-4c4d-4a32-8d64-87b1ebfca5d3-message",
      isBot: false
    });

    botOrUserResponse({
      content: "Hei! <br>Nimeni on Elykäs ja olen ELY-keskuksen kevyellä tekoälyllä höystetty chatbot. ",
      id: "5b097404-4c4d-4a32-8d64-87b1ebfca5d3-response-0",
      isBot: true
    });

    botOrUserResponse({
      content: "Kyllä",
      id: "2968ce0c-8d5e-4dec-9458-9a6ad2202c34-message",
      isBot: false
    });
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const globalQuickResponses: string[] = [];
  /**
   * Component render
   */
  return (
    <div className={ classes.root }>
      <Box className={ classes.messageListBox }>
        <MessageList
          messageDatas={ messageData }
          messagesEnd={ messagesEnd }
          waitingForBot={ waitingForBot }
          conversationStarted={ conversationStarted }
          quickResponses={ quickResponses }
          startConversation={ conversationStart }
          onSendMessage={ () => console.log("TODO") }
          onReset={ botReset }
          onWaitingForBotChange={ setWaitingForBot }
          userResponse={ botOrUserResponse }
          messagesEndUpdate={ messagesEndUpdate }
        />
      </Box>
      <Box className={ classes.messageInputBox }>
        <MessageInput
          inputOnly
          messagesEnd={ messagesEnd }
          waitingForBot={ waitingForBot }
          globalQuickResponses={ globalQuickResponses }
          hint={ hint || "Sano jotain..." }
          onSendMessage={ () => console.log("TODO") }
          conversationStarted={ conversationStarted }
          onReset={ botReset }
          onRestartConversation={ restartConversation }
        />
      </Box>
    </div>
  );
};

export default StoryPreviewView;