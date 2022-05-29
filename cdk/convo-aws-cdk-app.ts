#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkLambdaStack } from './stacks/cdklambda-stack';

const accountId = "579960896624";
const region = "us-east-1";

const app = new cdk.App();

new CdkLambdaStack(app, 'CdkLambdaStack', {
  env: {
    region: region,
    account: accountId
  }
});