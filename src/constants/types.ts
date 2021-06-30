import { Intent, Knot, Story, TrainingMaterial } from "../generated/client/models";

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
}