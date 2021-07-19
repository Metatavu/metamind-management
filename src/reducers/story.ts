import { StoryAction } from "../actions/story";
import { LOAD_STORY, SET_STORY } from "../constants/actionTypes";
import { StoryData } from "../types";

/**
 * Redux story state
 */
export interface StoryState {
  storyLoading: boolean;
  storyData?: StoryData
}


/**
 * Initial story state
 */
const initialState: StoryState = {
  storyLoading: false,
  storyData: undefined
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
    case LOAD_STORY:
      return { 
        ...state, 
        storyLoading: true, 
        storyData: undefined 
      };
    case SET_STORY:
      const storyData = action.storyData;

      return { 
        ...state,
        storyData,
        storyLoading: false 
      };
    default:
      return state;
  }
}
