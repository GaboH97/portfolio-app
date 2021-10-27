import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Code, Function, LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { join, resolve } from 'path';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';


interface UserPortfolio {
  id: { S: string };
  firstName: { S: string };
  lastName: { S: string };
  profilePhoto: { S: string }
  title: { S: string };
  description: { S: string };
  experienceSummary: { S: string };
  userId?: { S: string };
  username?: { S: string };
}

export class PortfolioAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const usersTable = new Table(this, 'UsersTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'users',
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const portfolioAppLambda = new NodejsFunction(this, 'portfolio-app-lambda', {
      entry: join(
        __dirname,
        "../portfolio-app-lambda",
        "handler.ts"
      ),
      depsLockFilePath: join(
        __dirname,
        "../portfolio-app-lambda",
        "package-lock.json"
      ),
      environment:{
        TABLE_NAME: usersTable.tableName
      },
      runtime: Runtime.NODEJS_14_X
    })

    // // pack all external deps in layer
    // const lambdaLayer = new LayerVersion(this, 'HandlerLayer', {
    //   code: Code.fromAsset(resolve(__dirname, '../portfolio-app-lambda/node_modules')),
    //   compatibleRuntimes:[Runtime.NODEJS_14_X],
    //   description: 'Api Handler Dependencies',
    // });


    // const portfolioAppLambda = new Function(this,
    //   "portfolio-app-lambda",
    //   {
    //     code: Code.fromAsset(resolve(__dirname, '../portfolio-app-lambda/dist'), {
    //       exclude: ['node_modules'],
    //     }),
    //     handler: 'main.handler',
    //     runtime: Runtime.NODEJS_14_X,
    //     layers: [lambdaLayer],
    //     environment: {
    //       NODE_PATH: '$NODE_PATH:/opt',
    //       tableName: usersTable.tableName,
    //     },
    //   }
    // );

    new AwsCustomResource(this, 'initDBResource', {
      onUpdate: {
        service: 'DynamoDB',
        action: 'putItem',
        parameters: {
          TableName: usersTable.tableName,
          Item: this.generateItem()
        },
        physicalResourceId: PhysicalResourceId.of('initDBData')
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: [usersTable.tableArn] })
    });

    usersTable.grantReadWriteData(portfolioAppLambda);

    const apiGW = new LambdaRestApi(this, 'portfolioAPI', {
      description: "API Gateway for Portfolio API",
      handler: portfolioAppLambda
    });
  }

  private generateItem = (): UserPortfolio => {
    return {
      id: { S: '1' },
      firstName: { S: 'James' },
      username: { S: 'jamesdrodriguez' },
      lastName: { S: 'Rodriguez' },
      description: { S: "James David Rodríguez Rubio (Cúcuta, Norte de Santander, Colombia, 12 de julio de 1991) es un futbolista colombiano nacionalizado español.1? Juega como centrocampista y su equipo actual es el Everton Football Club de la Premier League de Inglaterra" },
      profilePhoto: { S: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/James_Rodriguez_Training_2019-04-10_FC_Bayern_Muenchen-1.jpg/200px-James_Rodriguez_Training_2019-04-10_FC_Bayern_Muenchen-1.jpg" },
      title: { S: "James Rodríguez" },
      experienceSummary: { S: "La banca xd" }
    };
  }
}