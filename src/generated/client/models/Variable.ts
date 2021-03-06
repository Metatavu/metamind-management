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
    VariableType,
    VariableTypeFromJSON,
    VariableTypeFromJSONTyped,
    VariableTypeToJSON,
} from './';

/**
 * 
 * @export
 * @interface Variable
 */
export interface Variable {
    /**
     * variable id.
     * @type {string}
     * @memberof Variable
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof Variable
     */
    name: string;
    /**
     * 
     * @type {VariableType}
     * @memberof Variable
     */
    type: VariableType;
    /**
     * Story id
     * @type {string}
     * @memberof Variable
     */
    readonly storyId?: string;
    /**
     * Validation script
     * @type {string}
     * @memberof Variable
     */
    validationScript?: string;
    /**
     * Creation time
     * @type {Date}
     * @memberof Variable
     */
    readonly createdAt?: Date;
    /**
     * Last modification time
     * @type {Date}
     * @memberof Variable
     */
    readonly modifiedAt?: Date;
}

export function VariableFromJSON(json: any): Variable {
    return VariableFromJSONTyped(json, false);
}

export function VariableFromJSONTyped(json: any, ignoreDiscriminator: boolean): Variable {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'type': VariableTypeFromJSON(json['type']),
        'storyId': !exists(json, 'storyId') ? undefined : json['storyId'],
        'validationScript': !exists(json, 'validationScript') ? undefined : json['validationScript'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'modifiedAt': !exists(json, 'modifiedAt') ? undefined : (new Date(json['modifiedAt'])),
    };
}

export function VariableToJSON(value?: Variable | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'type': VariableTypeToJSON(value.type),
        'validationScript': value.validationScript,
    };
}


