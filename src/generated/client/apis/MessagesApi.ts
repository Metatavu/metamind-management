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


import * as runtime from '../runtime';
import {
    ErrorResponse,
    ErrorResponseFromJSON,
    ErrorResponseToJSON,
    Message,
    MessageFromJSON,
    MessageToJSON,
} from '../models';

export interface CreateMessageRequest {
    message: Message;
    storyId: string;
}

/**
 * 
 */
export class MessagesApi extends runtime.BaseAPI {

    /**
     * Posts new message
     * Posts new message
     */
    async createMessageRaw(requestParameters: CreateMessageRequest): Promise<runtime.ApiResponse<Message>> {
        if (requestParameters.message === null || requestParameters.message === undefined) {
            throw new runtime.RequiredError('message','Required parameter requestParameters.message was null or undefined when calling createMessage.');
        }

        if (requestParameters.storyId === null || requestParameters.storyId === undefined) {
            throw new runtime.RequiredError('storyId','Required parameter requestParameters.storyId was null or undefined when calling createMessage.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json;charset=utf-8';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("BearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/stories/{storyId}/messages`.replace(`{${"storyId"}}`, encodeURIComponent(String(requestParameters.storyId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MessageToJSON(requestParameters.message),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => MessageFromJSON(jsonValue));
    }

    /**
     * Posts new message
     * Posts new message
     */
    async createMessage(requestParameters: CreateMessageRequest): Promise<Message> {
        const response = await this.createMessageRaw(requestParameters);
        return await response.value();
    }

}
