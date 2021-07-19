import { MessageData } from "metamind-metatavu-bot/dist/types";
import { BotAction } from "../actions/bot";
import { BOT_INTERRUPTED, BOT_OR_USER_RESPONSE, BOT_RESET, CONVERSATION_START, MESSAGES_END_UPDATE } from "../constants/actionTypes";

/**
 * Redux bot state
 */
export interface BotState {
  messageDatas: MessageData[];
  conversationStarted: boolean;
  messagesEnd?: HTMLDivElement;
}

/**
 * Initial bot state
 */
const initialState: BotState = {
  messageDatas: [],
  conversationStarted: false,
  messagesEnd: undefined
}

/**
 * Redux reducer for all the states
 *
 * @param state bot state
 * @param action bot action
 * @returns changed bot state
 */
export function botReducer(state: BotState = initialState, action: BotAction): BotState {

  switch (action.type) {
    case BOT_OR_USER_RESPONSE:
      return { ...state, messageDatas: state.messageDatas.filter(messageData => !messageData.id.startsWith("temp")).concat([action.messageData])};
    case BOT_INTERRUPTED:
      return { ...state, messageDatas: state.messageDatas.filter(messageData => !messageData.id.startsWith("temp"))};
    case CONVERSATION_START:
      return { ...state, conversationStarted: true};
    case BOT_RESET:
      return { ...state, messageDatas: [], conversationStarted: false };
    case MESSAGES_END_UPDATE:
      const messagesEnd = action.messagesEnd;
      return { ...state, messagesEnd }
    default:
      return state;
  }
}
