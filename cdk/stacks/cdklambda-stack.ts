import { Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
 
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdklambdaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const lamdaFunction = new NodejsFunction(this, "testTypescriptLambda", {
      runtime: Runtime.NODEJS_14_X,    
      entry: path.join(__dirname, `../../api/handler.ts`),
      handler: "handler",
    })
  }
}
