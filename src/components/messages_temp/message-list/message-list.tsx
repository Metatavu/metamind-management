import * as React from "react";
import Typing from "../typing/typing";
import { WithStyles, withStyles, Box, Grow, Typography, Button, Dialog } from "@material-ui/core";
import { emojify } from "node-emoji";
import chatbot from "metamind-metatavu-bot/src/gfx/bot.svg";
import { styles } from "./message-list.style";
import { MessageData } from "../../../../metamind-metatavu-bot/src/types";

/**
 * Interface describing component properties
 */
interface Props extends WithStyles<typeof styles> {
  messageDatas: MessageData[];
  messagesEnd?: HTMLDivElement;
  quickResponses: string[];
  conversationStarted: boolean;
  waitingForBot: boolean;
  startConversation: () => void;
  onSendMessage: (messageContent: string) => void;
  onReset: () => void;
  onWaitingForBotChange: (waitingForBot: boolean) => void;
  userResponse: (message: MessageData) => void;
  messagesEndUpdate: (messageEnd?: HTMLDivElement) => void;
}

/**
 * Interface describing component state
 */
interface State {
  pendingMessage: string;
  triggerButtonAnimation: boolean;
  imageOpen: boolean;
  clickedImageUrl?: string;
}

/**
 * MessageList component. Provides the message list
 */
class MessageList extends React.Component<Props, State> {

  /**
   * Constructor
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      imageOpen: false,
      pendingMessage: "",
      triggerButtonAnimation: true,
    };
  }

  /**
   * Add new message
   * 
   * @param content the new message
   */
  public addNewMessage = (content: string) => {
    const {
      waitingForBot,
      userResponse,
      onWaitingForBotChange,
      onSendMessage
    } = this.props;

    if (waitingForBot) {
      return;
    }

    userResponse({
      id: "temp-message",
      content: content,
      isBot: false
    });

    onWaitingForBotChange(true);

    this.setState({ pendingMessage: "" });

    setTimeout(() => {
      userResponse({
        id: "temp-message",
        content: "",
        isBot: true
      });
      onSendMessage(content);
    }, 200);
  }

  /**
   * When send button is clicked
   */
  public onSendButtonClick = () => {
    const { pendingMessage } = this.state;
    pendingMessage && this.addNewMessage(this.state.pendingMessage);
  }

  /**
   * When Quick reply button is clicked
   * 
   * @param reply quick reply message
   */
  public sendQuickReply = (reply: string) => {
    this.addNewMessage(reply);
  }

  /**
   * Scroll to the bottom of the messages list
   */
  public scrollToBottom = () => {
    const { messagesEnd } = this.props;
    messagesEnd && messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Event handler for input key press
   * 
   * @param event React keyboard event
   */
  public handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.key === "Enter" && this.onSendButtonClick();
  }

  /**
   * Event handler for response click
   * 
   * @param event React synthetic click event
   */
  public handleResponseClick = (event: React.SyntheticEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.nodeName !== "IMG") {
      return;
    }

    const src = target.getAttribute("src");
    src && this.setState({
      clickedImageUrl: src,
      imageOpen: true
    });
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = () => {
    const { conversationStarted, startConversation } = this.props;
    conversationStarted && startConversation();
  }

  /**
   * Component did update life cycle event
   */
  public componentDidUpdate = (prevProps: Props) => {
    this.scrollToBottom();
  }

  /**
   * Event handler for pending message change
   * 
   * @param event change event
   */
  public onPendingMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pendingMessage: event.target.value as string });
  }

  /**
   * Component render method
   * 
   * @return returns child components
   */
  public render() {
    const { 
      classes, 
      messageDatas, 
      messagesEndUpdate,
      quickResponses,
      waitingForBot 
    } = this.props;

    const messageItems = messageDatas.map(messageData => messageData.isBot ? this.renderBotMessage(messageData) : this.renderUserMessage(messageData));
    const quickReplyItems = quickResponses.map(this.renderQuickReply);

    return (
      <Box className={ classes.messageListContainer }>
        { this.state.imageOpen && this.renderImageDisplay() }
        <Box style={{ position: "relative", width: "100%" }}>
          { messageItems }
        </Box>
        { quickResponses.length && !waitingForBot &&
          <Box className={ classes.quickReplyItems }>
            { quickReplyItems }
          </Box>
        }
        <div 
          style={{ float: "left", clear: "both" }} 
          ref={ element => element !== null && messagesEndUpdate(element) } 
        />
      </Box>
    );
  }

  /**
   * Method for rendering bot messages
   *
   * @param messageData message data
   * 
   * @return rendered bot messages
   */
  private renderBotMessage = (messageData: MessageData) => {
    const { classes } = this.props;

    return (
      <Box key={ messageData.id } className={ classes.messageListRow }>
        <Box className={ classes.botResponseContainer }>
          <div onClick={ this.handleResponseClick }>
            <Grow in>
              <Box className={ classes.botResponseRow }>
                <Box className={ classes.botImageContainer }>
                  <img src={ chatbot } />
                </Box>
                { messageData.content ? 
                  this.renderBotMessageContent(messageData) : 
                  this.renderBotMessageTyping() 
                }
              </Box>
            </Grow>
          </div>
        </Box>
      </Box>
    );
  }

  /**
   * Method for rendering bot messages
   *
   * @param messageData message data
   * 
   * @return rendered bot messages content
   */
  private renderBotMessageContent = (messageData: MessageData) => {
    const { classes } = this.props;

    return (
      <Box className={ classes.botResponse }>
        <Typography>
          <p dangerouslySetInnerHTML={{ __html: emojify(messageData.content) }} />
        </Typography>
      </Box>
    );
  }

  /**
   * Method for rendering bot messages
   *
   * @return rendered bot messages typing
   */
  private renderBotMessageTyping = () => {
    const { classes } = this.props;

    return (
      <Box className={ classes.botResponseTyping }>
        <Typing/>
      </Box>
    );
  }

  /**
   * Method for rendering user messages
   *
   * @param messageData message data
   * 
   * @return rendered user messages
   */
  private renderUserMessage = (messageData: MessageData) => {
    const { classes } = this.props;
    const messageVisible = messageData.content && !messageData.content.startsWith("INIT");

    return (
      <Box key={ messageData.id } className={ classes.messageListRow }>
        <Box width="100%" mt={ 4 } mb={ 4 }>
          <Box className={ classes.userMessageContainer }>
            { messageVisible && 
              <div 
                className={ classes.userMessage } 
                dangerouslySetInnerHTML={{ __html: messageData.content }} 
              /> 
            }
          </Box>
        </Box>
      </Box>
    );
  }

  /**
   * Method for rendering quick reply
   *
   * @param quickReply quick reply string
   * 
   * @return rendered quick reply
   */
    private renderQuickReply = (quickReply: string) => {
    const { classes, waitingForBot } = this.props;

    return (
      <Button 
        disabled={ waitingForBot } 
        className={ classes.quickReplyItem }
        key={ quickReply }
        onClick={ () => this.sendQuickReply(quickReply) } 
      >
        { quickReply }
      </Button>
    );
  }

  /**
   * Method for rendering image display
   *
   * @return rendered image display
   */
  private renderImageDisplay = () => (
  <Dialog 
    open={ this.state.imageOpen } 
    onClick={ () => this.setState({ imageOpen: false }) }
  >
    <img src={ this.state.clickedImageUrl || "" }/>
  </Dialog>
  )
}

export default withStyles(styles)(MessageList);
