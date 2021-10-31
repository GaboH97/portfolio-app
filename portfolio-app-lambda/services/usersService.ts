import { DocumentClient } from "aws-sdk/clients/dynamodb";
import UserNotFoundError from '../errors/userNotFoundError';
import { EditableUserPortfolio, User, UserPortfolio } from "../types";
import { getLastTweetsByUser } from "./twitterService";
const db = new DocumentClient();

/**
 * Builds a DynamoDB-specific update expression from an object containing fields to
 * update
 * @param {Object} fieldsToUpdate fields to update
 * @returns A DynamoDB-specific update expression object
 */
export function generateUpdateExpression(fieldsToUpdate: Object) {
    let ExpressionAttributeNames: any = {}
    let ExpressionAttributeValues: any = {}
    let exp = {
        UpdateExpression: 'set'
    };
    Object.entries(fieldsToUpdate).forEach(([key, item]) => {
        exp.UpdateExpression += ` #${key} = :${key},`;
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:${key}`] = item
    });
    exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
    return { ...exp, ExpressionAttributeNames, ExpressionAttributeValues }
}

/**
 * Gets info of a user with `userId` ID
 * @param userId Id of the user
 * @returns A user Object
 */
export async function getUserInfo(userId: string): Promise<User | null> {
    let user: User = {};
    const userPortfolio = await getUserPortfolioInfo(userId);
    console.log(`userPortfolio`, userPortfolio);
    user.details = userPortfolio;
    const userTweets = await getLastTweetsByUser(userPortfolio.userId);
    user.tweets = userTweets;
    return user;
}


/**
 * Gets the portfolio information of a user with a given `userId`
 * @param {string} userId Id of the user
 * @returns 
 */
export async function getUserPortfolioInfo(userId: string): Promise<UserPortfolio | null> {
    const results = await db.get({
        TableName: "users",
        Key: {
            id: userId
        }
    }).promise();
    console.log(`results.Item`, results.Item);
    if (!results.Item) throw new UserNotFoundError(userId);
    return results.Item as UserPortfolio;
}

/**
 * 
 * @param id Id of the user
 * @param userPortfolio 
 * @returns 
 */
export async function updateUserPortfolio(id: string, userPortfolio: EditableUserPortfolio) {

    await getUserPortfolioInfo(id);
    const updateExpression = generateUpdateExpression(userPortfolio);
    const updateItemOutput = await db.update({
        TableName: "users",
        Key: { id },
        UpdateExpression: updateExpression.UpdateExpression,
        ExpressionAttributeNames: updateExpression.ExpressionAttributeNames,
        ExpressionAttributeValues: updateExpression.ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    }).promise();
    return updateItemOutput.Attributes as UserPortfolio;
}