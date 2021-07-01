import * as React from "react";
import { WithStyles, withStyles, Box, OutlinedInput, Link, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send"
import { styles } from "./message-input.style";

/**
 * Interface describing component properties
 */
interface Props extends WithStyles<typeof styles>{
  inputOnly: boolean;
  messagesEnd?: HTMLDivElement;
  conversationStarted: boolean;
  waitingForBot: boolean;
  hint: string;
  globalQuickResponses: string[];
  onSendMessage: (messageContent: string) => void;
  onReset: () => void;
  onRestartConversation: () => void;
}

/**
 * Interface describing component state
 */
interface State {
  pendingMessage: string;
}

/**
 * Message input component. Provides the message input and quick responses 
 */
class MessageInput extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component properties 
   */
  constructor(props: Props) {
    super(props);
    this.state = { pendingMessage: "" };
  }

  /**
   * Component render method
   */
  public render() {
    const { inputOnly, hint, classes, waitingForBot } = this.props;
    const { pendingMessage } = this.state;

    const input = () => (
      <Box style={{ position: "relative" }}>
        <OutlinedInput
          fullWidth
          className={ classes.messageInput }
          placeholder={ hint }
          value={ pendingMessage }
          onChange={ this.onPendingMessageChange }
          onKeyPress={ this.handleInputKeyPress }
          onFocus={ () => setTimeout(this.scrollToBottom, 300) }
        />
        <IconButton
          color="primary"
          className={ classes.messageSend }
          disabled={ waitingForBot } 
          onClick={ this.onSendButtonClick }
        >
          <SendIcon/>
        </IconButton>
      </Box>
    )

    if (inputOnly) {
      return input();
    }

    return (
      <Box mt={ 2 } className={ classes.root }>  
        <Box className={ classes.messageInputContainer }>
          { input() }
        </Box>
        <Box>
          { this.renderGlobalQuickResponses() }
        </Box>
        <Box textAlign="center">
          <Link
            className={ classes.poweredBy }
            target="_blank"
            href="https://www.metamind.fi"
          >
            Powered by Metamind - a chatbot from Metatavu&nbsp;Oy
          </Link>
        </Box>
      </Box>
    );
  }

  /**
   * Renders global quick reponses
   */
  private renderGlobalQuickResponses = () => {
    const { classes, globalQuickResponses } = this.props;

    if (!globalQuickResponses.length) {
      return null;
    }

    const buttons = globalQuickResponses.map(globalQuickResponse => 
      <Link
        key={ globalQuickResponse } 
        onClick={ () => this.onGlobalQuickResponseClick(globalQuickResponse) }
      >
        { globalQuickResponse }
      </Link>
    );

    return (
      <Box className={ classes.globalQuickResponses }>
        { buttons }
      </Box>
    );
  }
  
  /**
   * Scroll to the bottom of the messages list
   */
  public scrollToBottom = () => {
    const { messagesEnd } = this.props;

    if (!messagesEnd) {
      return;
    }

    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Event handler for global quick response button click
   * 
   * @param globalQuickResponse global quick response
   */
  private onGlobalQuickResponseClick = (globalQuickResponse: string) => {
    this.props.onSendMessage(globalQuickResponse);
  }

  /**
   * Event handler for pending message change
   * 
   * @param event change event
   */
  private onPendingMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pendingMessage: event.target.value as string });
  }

  /**
   * Event handler for pending message change
   * 
   * @param event React keyboard event
   */
  private handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.key === "Enter" && this.onSendButtonClick();
  }

  /**
   * Event handler for send button click
   */
  private onSendButtonClick = () => {
    const { onSendMessage } = this.props;
    const { pendingMessage } = this.state;

    if (pendingMessage) {
      onSendMessage(pendingMessage);
      this.setState({ pendingMessage: "" });
    }
  }
}

export default withStyles(styles)(MessageInput);