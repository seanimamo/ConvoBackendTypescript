import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stage } from '../util/Stage';
import { createStageBasedId } from '../util/cdkUtils';
import { DYNAMODB_INDEXES } from '../../common/respositories/DynamoDBConstants';

type DynamoDBStackProps = {
  stage: Stage
} & StackProps;

export class DynamoDBStack extends Stack {
  public mainTableName: string;
  public mainTableArn: string;
  public mainTableArnGsi1Arn: string;
  public mainTableArnGsi2Arn: string;
  public mainTableArnGsi3Arn: string;
  public mainTableArnGsi4Arn: string;
  public mainTableArnGsi5Arn: string;

  constructor(scope: Construct, id: string, props: DynamoDBStackProps) {
    super(scope, id, props);

    this.mainTableName = createStageBasedId(props.stage, "ConvoMainTable")
    const mainTable = new Table(this, this.mainTableName, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: RemovalPolicy.RETAIN,
      tableName: this.mainTableName,
      partitionKey: {
        name: DYNAMODB_INDEXES.PRIMARY.partitionKeyName,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DYNAMODB_INDEXES.PRIMARY.sortKeyName,
        type: AttributeType.STRING
      }
    });
    this.mainTableArn = mainTable.tableArn;

    // GSI 1
    mainTable.addGlobalSecondaryIndex({
      indexName: DYNAMODB_INDEXES.GSI1.indexName!,
      partitionKey: {
        name: DYNAMODB_INDEXES.GSI1.partitionKeyName,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DYNAMODB_INDEXES.GSI1.sortKeyName,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi1Arn = `${mainTable.tableArn}/index/${DYNAMODB_INDEXES.GSI1.indexName!}`;

    // GSI 2
    mainTable.addGlobalSecondaryIndex({
      indexName: DYNAMODB_INDEXES.GSI2.indexName!,
      partitionKey: {
        name: DYNAMODB_INDEXES.GSI2.partitionKeyName,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DYNAMODB_INDEXES.GSI2.sortKeyName,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi2Arn = `${mainTable.tableArn}/index/${DYNAMODB_INDEXES.GSI2.indexName!}`;

    // GSI 3
    mainTable.addGlobalSecondaryIndex({
      indexName: DYNAMODB_INDEXES.GSI3.indexName!,
      partitionKey: {
        name: DYNAMODB_INDEXES.GSI3.partitionKeyName,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DYNAMODB_INDEXES.GSI3.sortKeyName,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi3Arn = `${mainTable.tableArn}/index/${DYNAMODB_INDEXES.GSI3.indexName!}`;

    // GSI 4
    mainTable.addGlobalSecondaryIndex({
      indexName: DYNAMODB_INDEXES.GSI4.indexName!,
      partitionKey: {
        name: DYNAMODB_INDEXES.GSI4.partitionKeyName,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DYNAMODB_INDEXES.GSI4.sortKeyName,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi4Arn = `${mainTable.tableArn}/index/${DYNAMODB_INDEXES.GSI4.indexName!}`;

    // GSI 5
    mainTable.addGlobalSecondaryIndex({
      indexName: DYNAMODB_INDEXES.GSI5.indexName!,
      partitionKey: {
        name: DYNAMODB_INDEXES.GSI5.partitionKeyName,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DYNAMODB_INDEXES.GSI5.sortKeyName,
        type: AttributeType.STRING
      }
    })
    this.mainTableArnGsi5Arn = `${mainTable.tableArn}/index/${DYNAMODB_INDEXES.GSI5.indexName!}`;
  }
}