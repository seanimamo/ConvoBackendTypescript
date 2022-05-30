import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stage } from '../Stage';
import { createStageBasedId } from '../util/cdkUtils';

type DynamoDBStackProps = {
  stage: Stage
} & StackProps;

export class DynamoDBStack extends Stack {
  public PARTITION_KEY: string = "PKEY";
  public SORT_KEY: string = "SKEY";

  public GSI1_INDEX_NAME: string = "GSI1";
  public GSI1_PARTITION_KEY: string = "GSI1PKEY";
  public GSI1_SORT_KEY: string = "GSI1SKEY";

  public GSI2_INDEX_NAME: string = "GSI2";
  public GSI2_PARTITION_KEY: string = "GSI2PKEY";
  public GSI2_SORT_KEY: string = "GSI2SKEY";

  public GSI3_INDEX_NAME: string = "GSI3";
  public GSI3_PARTITION_KEY: string = "GSI3PKEY";
  public GSI3_SORT_KEY: string = "GSI3SKEY";

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
        name: this.PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: this.SORT_KEY,
        type: AttributeType.STRING
      }
    });
    this.mainTableArn = mainTable.tableArn;

    // GSI 1
    mainTable.addGlobalSecondaryIndex({
      indexName: this.GSI1_INDEX_NAME,
      partitionKey: {
        name: this.GSI1_PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: this.GSI1_SORT_KEY,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi1Arn = `${mainTable.tableArn}/index/${this.GSI1_INDEX_NAME}`;

    // GSI 2
    mainTable.addGlobalSecondaryIndex({
      indexName: this.GSI2_INDEX_NAME,
      partitionKey: {
        name: this.GSI2_PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: this.GSI2_SORT_KEY,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi2Arn = `${mainTable.tableArn}/index/${this.GSI2_INDEX_NAME}`;

    // GSI 3
    mainTable.addGlobalSecondaryIndex({
      indexName: this.GSI3_INDEX_NAME,
      partitionKey: {
        name: this.GSI3_PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: this.GSI3_SORT_KEY,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi3Arn = `${mainTable.tableArn}/index/${this.GSI3_INDEX_NAME}`;

    const secondaryTable = new Table(this, 'ConvoSecondaryTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: RemovalPolicy.RETAIN,
      tableName: createStageBasedId(props.stage, "ConvoSecondaryTable"),
      partitionKey: {
        name: this.PARTITION_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: this.SORT_KEY,
        type: AttributeType.STRING
      }
    });
    this.secondaryTableArn = secondaryTable.tableArn;
  }
}