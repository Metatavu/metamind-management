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
export enum KnotScope {
    Global = 'global',
    Home = 'home',
    Basic = 'basic'
}

export function KnotScopeFromJSON(json: any): KnotScope {
    return KnotScopeFromJSONTyped(json, false);
}

export function KnotScopeFromJSONTyped(json: any, ignoreDiscriminator: boolean): KnotScope {
    return json as KnotScope;
}

export function KnotScopeToJSON(value?: KnotScope | null): any {
    return value as any;
}

