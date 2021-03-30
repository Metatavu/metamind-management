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
    ExportedStoryIntent,
    ExportedStoryIntentFromJSON,
    ExportedStoryIntentFromJSONTyped,
    ExportedStoryIntentToJSON,
    ExportedStoryKnot,
    ExportedStoryKnotFromJSON,
    ExportedStoryKnotFromJSONTyped,
    ExportedStoryKnotToJSON,
    ExportedStoryScript,
    ExportedStoryScriptFromJSON,
    ExportedStoryScriptFromJSONTyped,
    ExportedStoryScriptToJSON,
    ExportedStoryTrainingMaterial,
    ExportedStoryTrainingMaterialFromJSON,
    ExportedStoryTrainingMaterialFromJSONTyped,
    ExportedStoryTrainingMaterialToJSON,
    ExportedStoryVariable,
    ExportedStoryVariableFromJSON,
    ExportedStoryVariableFromJSONTyped,
    ExportedStoryVariableToJSON,
} from './';

/**
 * 
 * @export
 * @interface ExportedStory
 */
export interface ExportedStory {
    /**
     * Story name.
     * @type {string}
     * @memberof ExportedStory
     */
    name: string;
    /**
     * Default hint.
     * @type {string}
     * @memberof ExportedStory
     */
    defaultHint?: string;
    /**
     * Story locale.
     * @type {string}
     * @memberof ExportedStory
     */
    locale: string;
    /**
     * 
     * @type {Array<ExportedStoryKnot>}
     * @memberof ExportedStory
     */
    knots: Array<ExportedStoryKnot>;
    /**
     * 
     * @type {Array<ExportedStoryVariable>}
     * @memberof ExportedStory
     */
    variables: Array<ExportedStoryVariable>;
    /**
     * 
     * @type {Array<ExportedStoryScript>}
     * @memberof ExportedStory
     */
    scripts: Array<ExportedStoryScript>;
    /**
     * 
     * @type {Array<ExportedStoryIntent>}
     * @memberof ExportedStory
     */
    intents: Array<ExportedStoryIntent>;
    /**
     * 
     * @type {Array<ExportedStoryTrainingMaterial>}
     * @memberof ExportedStory
     */
    trainingMaterials: Array<ExportedStoryTrainingMaterial>;
}

export function ExportedStoryFromJSON(json: any): ExportedStory {
    return ExportedStoryFromJSONTyped(json, false);
}

export function ExportedStoryFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExportedStory {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'defaultHint': !exists(json, 'defaultHint') ? undefined : json['defaultHint'],
        'locale': json['locale'],
        'knots': ((json['knots'] as Array<any>).map(ExportedStoryKnotFromJSON)),
        'variables': ((json['variables'] as Array<any>).map(ExportedStoryVariableFromJSON)),
        'scripts': ((json['scripts'] as Array<any>).map(ExportedStoryScriptFromJSON)),
        'intents': ((json['intents'] as Array<any>).map(ExportedStoryIntentFromJSON)),
        'trainingMaterials': ((json['trainingMaterials'] as Array<any>).map(ExportedStoryTrainingMaterialFromJSON)),
    };
}

export function ExportedStoryToJSON(value?: ExportedStory | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'defaultHint': value.defaultHint,
        'locale': value.locale,
        'knots': ((value.knots as Array<any>).map(ExportedStoryKnotToJSON)),
        'variables': ((value.variables as Array<any>).map(ExportedStoryVariableToJSON)),
        'scripts': ((value.scripts as Array<any>).map(ExportedStoryScriptToJSON)),
        'intents': ((value.intents as Array<any>).map(ExportedStoryIntentToJSON)),
        'trainingMaterials': ((value.trainingMaterials as Array<any>).map(ExportedStoryTrainingMaterialToJSON)),
    };
}


