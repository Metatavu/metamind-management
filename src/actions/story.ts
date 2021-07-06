import * as ActionTypes from "../constants/actionTypes";
import { StoryData } from "../types";

/**
 * Interface for select story type
 */
export interface SelectStoryAction {
  type: ActionTypes.SELECT_STORY;
  storyId: string;
}

/**
 * Interface for story loading
 */
export interface LoadStoryAction {
  type: ActionTypes.LOAD_STORY;
}

/**
 * Interface for setting story
 */
export interface SetStoryDataAction {
  type: ActionTypes.SET_STORY;
  storyData?: StoryData;
}

/**
 * Interface for unselect story type
 */
export interface UnselectStoryAction {
  type: ActionTypes.UNSELECT_STORY;
}

/**
 * Story select method for access token
 *
 * @param storyId story Id
 */
export function selectStory(storyId: string): SelectStoryAction {
  return {
    type: ActionTypes.SELECT_STORY,
    storyId: storyId
  };
}

/**
 * method for loading the selected story
 */
export function loadStory(): LoadStoryAction {
  return {
    type: ActionTypes.LOAD_STORY
  }
}

/**
 *  Method for setting loaded story
 * 
 * @param storyData story data
 */
export function setStoryData(storyData: StoryData): SetStoryDataAction {
  return {
    type: ActionTypes.SET_STORY,
    storyData: storyData
  }
}

/**
 * Story unselect method
 */
export function unselectStory(): UnselectStoryAction {
  return {
    type: ActionTypes.UNSELECT_STORY
  };
}

export type StoryAction = SelectStoryAction | LoadStoryAction | SetStoryDataAction | UnselectStoryAction;
