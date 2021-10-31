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
* Clone Git Repository and move to project root directory
`git clone https://github.com/GaboH97/portfolio-app.git && cd portfolio-app`
* Bootstrap CDK (Only required for the first deployment)
`cdk bootstrap aws://ACCOUNT-NUMBER/REGION`
* Run bash script with environment variables
    * Unix/MacOS
        ```
        chmod +x cdk-deploy-to.sh
        ./deploy_to.sh <ACCOUNT_ID> <REGION> <TWITTER_ACCESS_TOKEN_KEY> <TWITTER_ACCESS_TOKEN_SECRET> <TWITTER_CONSUMER_KEY> <TWITTER_CONSUMER_SECRET> <TWITTER_BEARER_TOKEN>
        ```
        
    * Windows
        ```
        deploy_to <ACCOUNT_ID> <REGION> <TWITTER_ACCESS_TOKEN_KEY> <TWITTER_ACCESS_TOKEN_SECRET> <TWITTER_CONSUMER_KEY> <TWITTER_CONSUMER_SECRET> <TWITTER_BEARER_TOKEN>
        ``` 

When shell script is done it should print something like this:

![image](https://user-images.githubusercontent.com/20173148/139599511-d92c636f-4dc6-437c-9558-a715d6ddc921.png)

That is the API Gateway BaseURL endpoint

**To see Swagger Doc**

   * Navigate to portfolio-app-lambda/dist folder
   `cd portfolio-app-lambda/dist`
   * Run app file
   `node app.ts`
   * Run app file
   `node app.js`
   * Open Web Browser and go to docs endpoint `locahost:3000/docs`

**To see Code Documentation**
   * Navigate to portfolio-app-lambda folder
   `cd portfolio-app-lambda/`
   * Run doc command
     `npm run doc`
   * Open Web Browser and go to code docs endpoint `locahost:8080/`


**To run Unit Tests**
   
   * Remove `dist` folder in `portfolio-app-lambda`
   * Navigate to portfolio-app-lambda folder
   `cd portfolio-app-lambda/`
   * Run test command 
     `npm run test`

# Endpoints 

* GET <BaseURL>/users/1
* PATCH <BaseURL>/users/1
   

## Tecnologies Used

* NodeJS
* Express
* TypeScript
* NPM
* AWS
* AWS CLI
* AWS CDK
* Docker
* Git



## Total Development Time

4 days
