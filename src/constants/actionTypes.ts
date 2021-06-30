/**
 * Login action
 */
export const LOGIN = "LOGIN";
export type LOGIN = typeof LOGIN;

/**
 * Logout action
 */
export const LOGOUT = "LOGOUT";
export type LOGOUT = typeof LOGOUT;

/**
 * Set locale action
 */
export const SET_LOCALE = "SET_LOCALE";
export type SET_LOCALE = typeof SET_LOCALE;

/**
 * Select a story
 */
export const SELECT_STORY = "SELECT_STORY";
export type SELECT_STORY = typeof SELECT_STORY;

/**
 * Load a story
 */
export const LOAD_STORY = "LOAD_STORY";
export type LOAD_STORY = typeof LOAD_STORY;

/**
 * Set the story
 */
export const SET_STORY = "SET_STORY";
export type SET_STORY = typeof SET_STORY;

/**
 * Unselect a story
 */
export const UNSELECT_STORY = "UNSELECT_STORY";
export type UNSELECT_STORY = typeof UNSELECT_STORY;

/**
 * Interrupt the bot 
 */
export const BOT_INTERRUPTED = "BOT_INTERRUPTED";
export type BOT_INTERRUPTED = typeof BOT_INTERRUPTED;

/**
 * Start the convesation
 */
export const CONVERSATION_START = "CONVERSATION_START";
export type CONVERSATION_START = typeof CONVERSATION_START;

/**
 * Reset the bot
 */
export const BOT_RESET = "BOT_RESET";
export type BOT_RESET = typeof BOT_RESET;

/**
 * Bot or user response
 */
export const BOT_OR_USER_RESPONSE = "BOT_OR_USER_RESPONSE";
export type BOT_OR_USER_RESPONSE = typeof BOT_OR_USER_RESPONSE;

/**
 * Update the message end
 */
export const MESSAGES_END_UPDATE = "MESSAGES_END_UPDATE";
export type MESSAGES_END_UPDATE = typeof MESSAGES_END_UPDATE;
