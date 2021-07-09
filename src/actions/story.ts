import * as ActionTypes from "../constants/actionTypes";
import { StoryData } from "../types";

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

export type StoryAction = LoadStoryAction | SetStoryDataAction;

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
