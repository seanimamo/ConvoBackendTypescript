import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { Stage } from '../Stage';
import { createStageBasedId } from '../util/cdkUtils';

type DynamoDBStackProps = {
  stage: Stage
} & StackProps;

export class DynamoDBStack extends Stack {
  constructor(scope: Construct, id: string, props: DynamoDBStackProps) {
    super(scope, id, props);
 

    const table = new Table(this, 'Table', {
        billingMode: BillingMode.PAY_PER_REQUEST,
        pointInTimeRecovery: true,
        removalPolicy: RemovalPolicy.RETAIN,
        tableName: createStageBasedId(props.stage, "ConvoMainTable"),
        partitionKey: {
            name: "PKEY",
            type: AttributeType.STRING
        }
    })

    
  }
}