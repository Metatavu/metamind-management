/**
 * Interface describing an access token
 */
export interface AccessToken {
  token: string;
  userId: string;
};

/**
 * Interface describing a recent story 
 */
export interface RecentStory {
  id?: string;
  name?: string;
  lastEditedTime: string;
}