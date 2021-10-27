import Twitter from "twitter-lite";
import TwitterUserNotFoundError from "../errors/twitterUserNotFoundError";

export interface Tweet {
    id: string;
    text: string;
}

const MIN_TWEETS_FETCHED = 5;

/**
 * Twitter client initialization
 */
const twitterClient = new Twitter({
    extension: false,
    version: '2',
    consumer_key: 'bjkvOXFUvrGpoKYIARaeJwokE',
    consumer_secret: 'UmQwnJrg8r0OC6bHIgE0TOIyVX4yzv4IytWezJPIJgklvoopZb',
    access_token_key: '342800084-03q75jVSZPN15o16tH4JvleigGRsGA7bqZPa6lCz',
    access_token_secret: 'C6X0K8Zd06N1hZ5M4NkpnXLWQiHobBWZinKxStH7ilvXX',
    bearer_token:
        'AAAAAAAAAAAAAAAAAAAAAAEnFAEAAAAAMvBIw2zVFgkFaCTd7pEqCUF5KRU%3DnCNEPVhbLvDJZNVvfs4FksdDjuXKEXuDimdMP9nkGXQWM9Pjzr'
});

/**
 * Looks up a User ID  by their username
 * @param username User name of the user
 * @returns the user's user ID
 */
export async function getTwitterIdByUsername(username: string): Promise<string> {
    const response = await twitterClient.get(`users/by/username/${username}`);
    console.log(`response`, response);
    if (response.data) return response.data.id;
    else throw new TwitterUserNotFoundError(username);
    
}

/**
 * Obtains the last N tweets tweeted by a user with a `userId`
 * @param userId the user's user ID
 * @param tweetCount number of tweets to be fetched @default 5
 * @returns the list of tweets
 */
export async function getLastTweetsByUser(userId: string, tweetCount: number = MIN_TWEETS_FETCHED): Promise<Tweet[]> {
    console.log(`tweetCount`, tweetCount);
    const response = await twitterClient.get(`users/${userId}/tweets`, { max_results: tweetCount });
    console.log(`response`, response);
    console.log(`response.data`, response.data);
    return response.data as Tweet[];
}