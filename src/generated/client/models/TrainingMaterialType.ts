/* tslint:disable */
/* eslint-disable */
/**
 * Metamind API
 * Brain spec for Metamind.
 *
 * The version of the OpenAPI document: 2.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * 
 * @export
 * @enum {string}
 */
export enum TrainingMaterialType {
    INTENTREGEX = 'INTENTREGEX',
    INTENTOPENNLPDOCCAT = 'INTENTOPENNLPDOCCAT',
    VARIABLEOPENNLPNER = 'VARIABLEOPENNLPNER',
    VARIABLEOPENNLPREGEX = 'VARIABLEOPENNLPREGEX'
}

export function TrainingMaterialTypeFromJSON(json: any): TrainingMaterialType {
    return TrainingMaterialTypeFromJSONTyped(json, false);
}

export function TrainingMaterialTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): TrainingMaterialType {
    return json as TrainingMaterialType;
}

export function TrainingMaterialTypeToJSON(value?: TrainingMaterialType | null): any {
    return value as any;
}

