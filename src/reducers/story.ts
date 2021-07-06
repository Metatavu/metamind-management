import { StoryAction } from "../actions/story";
import { LOAD_STORY, SELECT_STORY, SET_STORY, UNSELECT_STORY } from "../constants/actionTypes";
import { StoryData } from "../types";

/**
 * Redux story state
 */
export interface StoryState {
  selectedStoryId: string;
  storyLoading: boolean;
  storyData?: StoryData
}


/**
 * Initial story state
 */
const initialState: StoryState = {
  selectedStoryId: "",
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
    case SELECT_STORY:
      const selectedStoryId = action.storyId;

      return { 
        ...state, 
        selectedStoryId, 
        storyLoading: false, 
        storyData: undefined 
      };
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
    case UNSELECT_STORY:
      return { 
        ...state, 
        selectedStoryId: "", 
        storyLoading: false, 
        storyData: undefined 
      };
    default:
      return state;
  }
}
