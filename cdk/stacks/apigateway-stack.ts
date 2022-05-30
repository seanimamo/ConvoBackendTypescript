import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

export class ApiGatwayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
 

    const restApi = new RestApi(this, "ConvoApiV2", {
      restApiName: "ConvoApiV2"
    });

    const lamdaFunction = new NodejsFunction(this, "testTypescriptLambda", {
      runtime: Runtime.NODEJS_14_X,    
      entry: path.join(__dirname, `../../api/handler.ts`),
      handler: "handler",
    })

    restApi.root.addResource("test").addResource("{parameter}").addMethod("GET", new LambdaIntegration(lamdaFunction));
  }
}