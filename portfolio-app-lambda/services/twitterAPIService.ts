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
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
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
    const response = await twitterClient.get(`users/${userId}/tweets`, { max_results: tweetCount });
    console.log(`response`, response);
    console.log(`response.data`, response.data);
    return response.data as Tweet[];
}