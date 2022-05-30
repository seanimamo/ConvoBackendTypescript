#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatwayStack } from './stacks/apigateway-stack';

const accountId = "579960896624";
const region = "us-east-1";

const app = new cdk.App();

new ApiGatwayStack(app, 'ApiGatwayStack', {
  env: {
    region: region,
    account: accountId
  }
});