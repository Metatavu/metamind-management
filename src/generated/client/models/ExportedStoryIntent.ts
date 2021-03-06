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

import { exists, mapValues } from '../runtime';
import {
    IntentType,
    IntentTypeFromJSON,
    IntentTypeFromJSONTyped,
    IntentTypeToJSON,
} from './';

/**
 * 
 * @export
 * @interface ExportedStoryIntent
 */
export interface ExportedStoryIntent {
    /**
     * intent id.
     * @type {string}
     * @memberof ExportedStoryIntent
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ExportedStoryIntent
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ExportedStoryIntent
     */
    quickResponse?: string;
    /**
     * 
     * @type {number}
     * @memberof ExportedStoryIntent
     */
    quickResponseOrder: number;
    /**
     * 
     * @type {IntentType}
     * @memberof ExportedStoryIntent
     */
    type: IntentType;
    /**
     * source knot id.
     * @type {string}
     * @memberof ExportedStoryIntent
     */
    sourceKnotId?: string;
    /**
     * target knot id.
     * @type {string}
     * @memberof ExportedStoryIntent
     */
    targetKnotId: string;
    /**
     * 
     * @type {boolean}
     * @memberof ExportedStoryIntent
     */
    global: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExportedStoryIntent
     */
    trainingMaterialIds?: Array<string>;
}

export function ExportedStoryIntentFromJSON(json: any): ExportedStoryIntent {
    return ExportedStoryIntentFromJSONTyped(json, false);
}

export function ExportedStoryIntentFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExportedStoryIntent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'quickResponse': !exists(json, 'quickResponse') ? undefined : json['quickResponse'],
        'quickResponseOrder': json['quickResponseOrder'],
        'type': IntentTypeFromJSON(json['type']),
        'sourceKnotId': !exists(json, 'sourceKnotId') ? undefined : json['sourceKnotId'],
        'targetKnotId': json['targetKnotId'],
        'global': json['global'],
        'trainingMaterialIds': !exists(json, 'trainingMaterialIds') ? undefined : json['trainingMaterialIds'],
    };
}

export function ExportedStoryIntentToJSON(value?: ExportedStoryIntent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'quickResponse': value.quickResponse,
        'quickResponseOrder': value.quickResponseOrder,
        'type': IntentTypeToJSON(value.type),
        'sourceKnotId': value.sourceKnotId,
        'targetKnotId': value.targetKnotId,
        'global': value.global,
        'trainingMaterialIds': value.trainingMaterialIds,
    };
}


