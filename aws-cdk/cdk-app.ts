#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from './stacks/apigateway-stack';
import { Stage } from './Stage';
import { createStageBasedId } from './util/cdkUtils';
import { DynamoDBStack } from './stacks/dynamodb-stack';
import { ConvoCognitoStack } from './stacks/cognito-stack';

const accountId = "579960896624";
const region = "us-east-1";

const createConvoApp = (stage: Stage) => {
  // new ApiGatewayStack(app, createStageBasedId(stage, "ConvoApiGatewayStack"), {
  //   env: {
  //     region: region,
  //     account: accountId
  //   },
  //   stage: stage
  // });

  const dynamoDbStack = new DynamoDBStack(app, createStageBasedId(stage, "ConvoDynamoDBStack"), {
    env: {
      region: region,
      account: accountId
    },
    terminationProtection: true,
    stage: stage,
  });

  new ConvoCognitoStack(app, createStageBasedId(stage, "ConvoCognitoStack"), {
    env: {
      region: region,
      account: accountId
    },
    terminationProtection: true,
    stage: stage,
    convoDynamoMainTableName: dynamoDbStack.mainTableName,
    convoMainDynamoTableArn: dynamoDbStack.mainTableArn
  })
}

const app = new cdk.App();
createConvoApp(Stage.BETA);