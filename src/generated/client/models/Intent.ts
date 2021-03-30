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
    IntentTrainingMaterials,
    IntentTrainingMaterialsFromJSON,
    IntentTrainingMaterialsFromJSONTyped,
    IntentTrainingMaterialsToJSON,
    IntentType,
    IntentTypeFromJSON,
    IntentTypeFromJSONTyped,
    IntentTypeToJSON,
} from './';

/**
 * 
 * @export
 * @interface Intent
 */
export interface Intent {
    /**
     * intent id.
     * @type {string}
     * @memberof Intent
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof Intent
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof Intent
     */
    quickResponse?: string;
    /**
     * 
     * @type {number}
     * @memberof Intent
     */
    quickResponseOrder: number;
    /**
     * 
     * @type {IntentType}
     * @memberof Intent
     */
    type: IntentType;
    /**
     * source knot id id.
     * @type {string}
     * @memberof Intent
     */
    sourceKnotId?: string;
    /**
     * target knot id id.
     * @type {string}
     * @memberof Intent
     */
    targetKnotId: string;
    /**
     * 
     * @type {boolean}
     * @memberof Intent
     */
    global: boolean;
    /**
     * 
     * @type {IntentTrainingMaterials}
     * @memberof Intent
     */
    trainingMaterials: IntentTrainingMaterials;
    /**
     * Creation time
     * @type {Date}
     * @memberof Intent
     */
    readonly createdAt?: Date;
    /**
     * Last modification time
     * @type {Date}
     * @memberof Intent
     */
    readonly modifiedAt?: Date;
}

export function IntentFromJSON(json: any): Intent {
    return IntentFromJSONTyped(json, false);
}

export function IntentFromJSONTyped(json: any, ignoreDiscriminator: boolean): Intent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'quickResponse': !exists(json, 'quickResponse') ? undefined : json['quickResponse'],
        'quickResponseOrder': json['quickResponseOrder'],
        'type': IntentTypeFromJSON(json['type']),
        'sourceKnotId': !exists(json, 'sourceKnotId') ? undefined : json['sourceKnotId'],
        'targetKnotId': json['targetKnotId'],
        'global': json['global'],
        'trainingMaterials': IntentTrainingMaterialsFromJSON(json['trainingMaterials']),
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'modifiedAt': !exists(json, 'modifiedAt') ? undefined : (new Date(json['modifiedAt'])),
    };
}

export function IntentToJSON(value?: Intent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'quickResponse': value.quickResponse,
        'quickResponseOrder': value.quickResponseOrder,
        'type': IntentTypeToJSON(value.type),
        'sourceKnotId': value.sourceKnotId,
        'targetKnotId': value.targetKnotId,
        'global': value.global,
        'trainingMaterials': IntentTrainingMaterialsToJSON(value.trainingMaterials),
    };
}


