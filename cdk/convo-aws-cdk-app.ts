#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatwayStack } from './stacks/apigateway-stack';
import { Stage } from './Stage';
import { createStageBasedId } from './util/cdkUtils';

const accountId = "579960896624";
const region = "us-east-1";

const createConvoApp = (stage: Stage) => {
  new ApiGatwayStack(app, createStageBasedId(stage, "ApiGatewayStack"), {
    env: {
      region: region,
      account: accountId
    },
    stage: stage
  });
}



const app = new cdk.App();
createConvoApp(Stage.BETA);