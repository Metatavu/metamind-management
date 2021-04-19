import { Configuration } from "../generated/client";
import { AccessToken } from "../types";
import { KnotsApi } from '../generated/client/apis/KnotsApi';
import { StoriesApi } from '../generated/client/apis/StoriesApi';
import { IntentsApi } from '../generated/client/apis/IntentsApi';

/**
 * Utility class for loading api with predefined configuration
 */
export default class Api {

  /**
   * Gets api configuration
   *
   * @param accessToken access token
   * @returns new configuration
   */
  private static getConfiguration(accessToken: AccessToken) {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_PATH,
      accessToken: accessToken.token
    });
  }

  /**
   * Gets initialized Knots API
   * 
   * @param AccessToken Gets knots API
   * @returns initialized Knots API
   */
  public static getKnotsApi(accessToken: AccessToken) {
    return new KnotsApi(Api.getConfiguration(accessToken));
  }

  /**
   * Gets initialized Stories API
   * 
   * @param accessToken access token
   * @returns initialized Stories API
   */
  public static getStoriesApi(accessToken: AccessToken) {
    return new StoriesApi(Api.getConfiguration(accessToken));
  }

  /**
   * Gets initialized Intents API
   * 
   * @param accessToken access token
   * @returns initialized Intents API
   */
  public static getIntentsApi(accessToken: AccessToken) {
    return new IntentsApi(Api.getConfiguration(accessToken));
  }
}
