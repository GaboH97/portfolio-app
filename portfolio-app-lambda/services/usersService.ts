import * as AWS from "aws-sdk";
// AWS.config.update({ region: "us-east-1" })
import { DocumentClient } from "aws-sdk/clients/dynamodb";
const db = new DocumentClient();

/**
 * Builds a DynamoDB-specific update expression from an object containing fields to
 * update
 * @param {Object} fieldsToUpdate fields to update
 * @returns A DynamoDB-specific update expression object
 */
function generateUpdateExpression(fieldsToUpdate: Object) {
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
 * 
 * @param userId Id of the user
 * @returns 
 */
export async function getUserPortfolioInfo(userId: string) {
    const results = await db.get({
        TableName: process.env.TABLE_NAME,
        Key: {
            id: userId
        }
    }).promise();
    console.log(`results.Item`, results.Item);
    if (!results.Item) return null;
    return results.Item as UserPortfolio;
}

/**
 * 
 * @param id Id of the user
 * @param userPortfolio 
 * @returns 
 */
export async function updateUserPortfolio(id: string, userPortfolio: EditableUserPortfolio) {
    const updateExpression = generateUpdateExpression(userPortfolio);

    const updateItemOutput = await db.update({
        TableName: process.env.TABLE_NAME,
        Key: { id },
        UpdateExpression: updateExpression.UpdateExpression,
        ExpressionAttributeNames: updateExpression.ExpressionAttributeNames,
        ExpressionAttributeValues: updateExpression.ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    }).promise();

    console.log(`updateItemOutput.Attributes`, updateItemOutput.Attributes);
    return updateItemOutput.Attributes as UserPortfolio;
}