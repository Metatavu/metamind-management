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
export enum VariableType {
    STRING = 'STRING',
    NUMBER = 'NUMBER'
}

export function VariableTypeFromJSON(json: any): VariableType {
    return VariableTypeFromJSONTyped(json, false);
}

export function VariableTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): VariableType {
    return json as VariableType;
}

export function VariableTypeToJSON(value?: VariableType | null): any {
    return value as any;
}

