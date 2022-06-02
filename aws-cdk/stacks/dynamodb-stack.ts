import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stage } from '../Stage';
import { createStageBasedId } from '../util/cdkUtils';

type DynamoDBStackProps = {
  stage: Stage
} & StackProps;

export class DynamoDBStack extends Stack {
  public static PARTITION_KEY: string = "PKEY";
  public static SORT_KEY: string = "SKEY";

  public static GSI1_INDEX_NAME: string = "GSI1";
  public static GSI1_PARTITION_KEY: string = "GSI1PKEY";
  public static GSI1_SORT_KEY: string = "GSI1SKEY";

  public static GSI2_INDEX_NAME: string = "GSI2";
  public static GSI2_PARTITION_KEY: string = "GSI2PKEY";
  public static GSI2_SORT_KEY: string = "GSI2SKEY";

  public static GSI3_INDEX_NAME: string = "GSI3";
  public static GSI3_PARTITION_KEY: string = "GSI3PKEY";
  public static GSI3_SORT_KEY: string = "GSI3SKEY";

  public mainTableArn: string;
  public mainTableArnGsi1Arn: string;
  public mainTableArnGsi2Arn: string;
  public mainTableArnGsi3Arn: string;
  public secondaryTableArn: string;

  constructor(scope: Construct, id: string, props: DynamoDBStackProps) {
    super(scope, id, props);

    const mainTable = new Table(this, 'ConvoMainTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: RemovalPolicy.RETAIN,
      tableName: createStageBasedId(props.stage, "ConvoMainTable"),
      partitionKey: {
        name: DynamoDBStack.PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DynamoDBStack.SORT_KEY,
        type: AttributeType.STRING
      }
    });
    this.mainTableArn = mainTable.tableArn;

    // GSI 1
    mainTable.addGlobalSecondaryIndex({
      indexName: DynamoDBStack.GSI1_INDEX_NAME,
      partitionKey: {
        name: DynamoDBStack.GSI1_PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DynamoDBStack.GSI1_SORT_KEY,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi1Arn = `${mainTable.tableArn}/index/${DynamoDBStack.GSI1_INDEX_NAME}`;

    // GSI 2
    mainTable.addGlobalSecondaryIndex({
      indexName: DynamoDBStack.GSI2_INDEX_NAME,
      partitionKey: {
        name: DynamoDBStack.GSI2_PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DynamoDBStack.GSI2_SORT_KEY,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi2Arn = `${mainTable.tableArn}/index/${DynamoDBStack.GSI2_INDEX_NAME}`;

    // GSI 3
    mainTable.addGlobalSecondaryIndex({
      indexName: DynamoDBStack.GSI3_INDEX_NAME,
      partitionKey: {
        name: DynamoDBStack.GSI3_PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DynamoDBStack.GSI3_SORT_KEY,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi3Arn = `${mainTable.tableArn}/index/${DynamoDBStack.GSI3_INDEX_NAME}`;

    const secondaryTable = new Table(this, 'ConvoSecondaryTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: RemovalPolicy.RETAIN,
      tableName: createStageBasedId(props.stage, "ConvoSecondaryTable"),
      partitionKey: {
        name: DynamoDBStack.PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DynamoDBStack.SORT_KEY,
        type: AttributeType.STRING
      }
    });
    this.secondaryTableArn = secondaryTable.tableArn;
  }
}