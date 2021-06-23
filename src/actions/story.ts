import * as ActionTypes from "../constants/actionTypes";

/**
 * Interface for select story type
 */
export interface SelectStoryAction {
  type: ActionTypes.SELECT_STORY;
  storyId: string;
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
 * Story unselect method
 */
export function unselectStory(): UnselectStoryAction {
  return {
    type: ActionTypes.UNSELECT_STORY
  };
}

export type StoryAction = SelectStoryAction | UnselectStoryAction;
