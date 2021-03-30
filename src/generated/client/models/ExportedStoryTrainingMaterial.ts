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
    TrainingMaterialType,
    TrainingMaterialTypeFromJSON,
    TrainingMaterialTypeFromJSONTyped,
    TrainingMaterialTypeToJSON,
} from './';

/**
 * 
 * @export
 * @interface ExportedStoryTrainingMaterial
 */
export interface ExportedStoryTrainingMaterial {
    /**
     * training material id.
     * @type {string}
     * @memberof ExportedStoryTrainingMaterial
     */
    id?: string;
    /**
     * 
     * @type {TrainingMaterialType}
     * @memberof ExportedStoryTrainingMaterial
     */
    type: TrainingMaterialType;
    /**
     * 
     * @type {string}
     * @memberof ExportedStoryTrainingMaterial
     */
    text: string;
    /**
     * 
     * @type {string}
     * @memberof ExportedStoryTrainingMaterial
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ExportedStoryTrainingMaterial
     */
    visibility: string;
}

export function ExportedStoryTrainingMaterialFromJSON(json: any): ExportedStoryTrainingMaterial {
    return ExportedStoryTrainingMaterialFromJSONTyped(json, false);
}

export function ExportedStoryTrainingMaterialFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExportedStoryTrainingMaterial {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'type': TrainingMaterialTypeFromJSON(json['type']),
        'text': json['text'],
        'name': json['name'],
        'visibility': json['visibility'],
    };
}

export function ExportedStoryTrainingMaterialToJSON(value?: ExportedStoryTrainingMaterial | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'type': TrainingMaterialTypeToJSON(value.type),
        'text': value.text,
        'name': value.name,
        'visibility': value.visibility,
    };
}


