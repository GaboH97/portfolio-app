import serverlessExpress from "@vendia/serverless-express";
import { Handler, Context, Callback } from "aws-lambda";
import app from "./app";

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    const expressApp = serverlessExpress({ app });
    return expressApp(event, context, callback);
};