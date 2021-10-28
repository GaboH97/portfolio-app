# Portfolio Web App

## Description

This project consist of a simple portfolio NodeJS based web application that displays portfolio and personal information of some users, including their last 5 tweets from their user timeline. It allows the end user to get and modify profile information.

## Architecture

This application infrastucture has 100% AWS cloud-based deployment, which is consists of three main components: an **AWS API Gateway** for REST API management, an **AWS Lambda** to handle application logic and a **AWS DynamoDB** as serverless NoSQL database. API Gateway is connected to the Lambda via native lambda integration and handled by express app using the `serverless-express` package which pipes incoming events in the lambda handler to HTTP request. Database-related operations are handled through `DocumentClient` from the `aws-sdk` package.

![Portfolio App Architecture Diagram](https://github.com/GaboH97/portfolio-app/blob/main/Portfolio%20App%20Architecture%20Diagram.png?raw=true)


## Prerequistes

* Install [Node JS](https://nodejs.org/es/) (14.X LTS or above)
* Install [Docker](https://docs.docker.com/get-docker/)
* Install [Git](https://git-scm.com)
* Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
* Install [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

## Set Up


* Configure AWS Credentials
`aws configure`
* Install AWS CDK as a global module 
`npm install -g aws-cdk`
* Install TypeScript as a global module
`npm install -g typescript`
* Clone Git Repository
`git clone https://github.com/GaboH97/portfolio-app.git && cd portfolio-app`
* Bootstrap CDK
`cdk bootstrap aws://ACCOUNT-NUMBER/REGION`
* Generate synthesized CloudFormation template
`cdk synth`
* Deploy CloudFormation stack to AWS Account/Region
`cdk Deploy`


## Tecnologies Used

* NodeJS
* Express
* Handlebars
* TypeScript
* NPM
* AWS
* AWS CLI
* AWS CDK
* Docker
* Git
