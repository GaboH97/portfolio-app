import Twitter from "twitter-lite";
import { Tweet } from "../types/tweet";

export const DEFAULT_TWEETS_FETCHED = 5;

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
 * Obtains the last N tweets tweeted by a user with a `userId`
 * @param userId the user's user ID
 * @param tweetCount number of tweets to be fetched @default 5
 * @returns the list of tweets
 */
export async function getLastTweetsByUser(userId: string, tweetCount: number = DEFAULT_TWEETS_FETCHED): Promise<Tweet[]> {
    const response = await twitterClient.get(`users/${userId}/tweets`, { max_results: tweetCount });
    return response.data as Tweet[];
}