import { StoryAction } from "../actions/story";
import { SELECT_STORY, UNSELECT_STORY } from "../constants/actionTypes";

/**
 * Redux story state
 */
export interface StoryState {
  storySelected?: boolean;
  storyId: string | null;
}

/**
 * Initial story state
 */
const initialState: StoryState = {
  storySelected: undefined,
  storyId: null
}

/**
 * Redux reducer for story
 *
 * @param state story state
 * @param action story action
 * @returns changed story state
 */
export function storyReducer(state: StoryState = initialState, action: StoryAction): StoryState {
  switch (action.type) {
    case SELECT_STORY:
      const storyId = action.storyId;
      return { ...state, storySelected: true, storyId: storyId };
    case UNSELECT_STORY:
      return { ...state, storySelected: false, storyId: null };
    default:
      return state;
  }
}
