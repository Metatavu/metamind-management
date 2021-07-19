import { MessageData } from "metamind-metatavu-bot/dist/types";
import * as ActionTypes from "../constants/actionTypes";

/**
 * Interface for bot or user response action type
 */
export interface BotOrUserResponseAction {
  type: ActionTypes.BOT_OR_USER_RESPONSE;
  messageData: MessageData;
}

/**
 * Interface for reset bot action type
 */
export interface BotResetAction {
  type: ActionTypes.BOT_RESET;
}

/**
 * Interface for bot interrupt action type
 */
export interface BotInterruptedAction {
  type: ActionTypes.BOT_INTERRUPTED;
}

/**
 * Interface for conversation start action type
 */
export interface ConversationStartAction {
  type: ActionTypes.CONVERSATION_START;
}

/**
 * Interface for update message end action type
 */
export interface MessagesEndUpdateAction {
  type: ActionTypes.MESSAGES_END_UPDATE;
  messagesEnd?: HTMLDivElement;
}

export type BotAction = BotOrUserResponseAction | BotResetAction | BotInterruptedAction | ConversationStartAction | MessagesEndUpdateAction;

/**
 * Bot or user response method
 * 
 * @param messageData Message Data
 */
export function botOrUserResponse(messageData: MessageData): BotOrUserResponseAction{
  return {
    type: ActionTypes.BOT_OR_USER_RESPONSE,
    messageData: messageData
  };
}

/**
 * Reset bot method
 */
export function botReset(): BotResetAction {
  return {
    type: ActionTypes.BOT_RESET
  };
}

/**
 * Bot interrupt method
 */
export function botInterrupted(): BotInterruptedAction {
  return {
    type: ActionTypes.BOT_INTERRUPTED
  };
}

/**
 * Conversation start method
 */
export function conversationStart(): ConversationStartAction {
  return {
    type: ActionTypes.CONVERSATION_START
  };
}

/**
 * Update message end method
 * 
 * @param messageData Message end div
 */
export function messagesEndUpdate(messagesEnd?: HTMLDivElement): MessagesEndUpdateAction {
  return {
    type: ActionTypes.MESSAGES_END_UPDATE,
    messagesEnd: messagesEnd
  };
}