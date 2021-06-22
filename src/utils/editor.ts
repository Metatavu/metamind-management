import { IntentTrainingMaterials, TrainingMaterialType } from "../generated/client/models";

export default class EditorUtils {

  /**
   * Converts a training material type into intent training material key
   * 
   * @param name training material type key or value
   * @returns object key
   */
  public static objectKeyConversion = (name: string): keyof IntentTrainingMaterials => (({
    [TrainingMaterialType.INTENTOPENNLPDOCCAT]: "intentOpenNlpDoccatId",
    [TrainingMaterialType.INTENTREGEX]: "intentRegexId",
    [TrainingMaterialType.VARIABLEOPENNLPNER]: "variableOpenNlpNerId",
    [TrainingMaterialType.VARIABLEOPENNLPREGEX]: "variableOpenNlpRegex"
  })[name as TrainingMaterialType] ?? "intentOpenNlpDoccatId") as keyof IntentTrainingMaterials;

}

