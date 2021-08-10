import { Intent, Knot, Story, TrainingMaterial, Script } from "../generated/client/models";

/**
 * Interface describing an access token
 */
export interface AccessToken {
  token: string;
  userId: string;
}

/**
 * Interface describing a recent story 
 */
export interface RecentStory {
  id?: string;
  name?: string;
  lastEditedTime: string;
}

/**
 * Story data
 */
export interface StoryData {
  story?: Story;
  knots?: Knot[];
  intents?: Intent[];
  selectedKnot?: Knot;
  selectedIntent? : Intent;
  trainingMaterial?: TrainingMaterial[];
  scripts?: Script[];
}