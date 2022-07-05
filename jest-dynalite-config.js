const { Stage } = require("./aws-cdk/util/Stage");
const { createStageBasedId } = require("./aws-cdk/util/cdkUtils");
const { DYNAMODB_INDEXES } = require("./common/respositories/DynamoDBConstants")

module.exports = {
  tables: [
    {
      TableName: createStageBasedId(Stage.BETA, "ConvoMainTable"),
      KeySchema: [
        { AttributeName: DYNAMODB_INDEXES.PRIMARY.partitionKeyName, KeyType: "HASH" },
        { AttributeName: DYNAMODB_INDEXES.PRIMARY.sortKeyName, KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: DYNAMODB_INDEXES.PRIMARY.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.PRIMARY.sortKeyName, AttributeType: "S" },
        
        { AttributeName: DYNAMODB_INDEXES.GSI1.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI1.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI2.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI2.sortKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI3.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI3.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI4.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI4.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI5.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI5.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI6.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI6.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI7.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI7.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI8.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI8.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI9.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI9.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI10.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI10.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI11.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI11.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI12.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI12.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI13.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI13.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI14.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI14.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI15.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI15.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI16.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI16.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI17.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI17.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI18.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI18.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI19.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI19.sortKeyName, AttributeType: "S" },

        { AttributeName: DYNAMODB_INDEXES.GSI20.partitionKeyName, AttributeType: "S" },
        { AttributeName: DYNAMODB_INDEXES.GSI20.sortKeyName, AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
      GlobalSecondaryIndexes: [{
        IndexName: DYNAMODB_INDEXES.GSI1.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI1.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI1.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI2.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI2.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI2.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI3.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI3.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI3.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI4.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI4.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI4.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI5.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI5.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI5.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI6.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI6.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI6.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI7.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI7.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI7.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI8.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI8.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI8.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI9.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI9.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI9.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI10.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI10.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI10.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI11.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI11.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI11.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI12.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI12.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI12.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI13.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI13.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI13.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI14.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI14.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI14.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI15.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI15.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI15.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI16.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI16.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI16.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI17.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI17.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI17.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI18.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI18.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI18.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI19.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI19.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI19.sortKeyName, KeyType: "RANGE" },
        ]
      },
      {
        IndexName: DYNAMODB_INDEXES.GSI20.indexName,
        Projection: {
          ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [
          { AttributeName: DYNAMODB_INDEXES.GSI20.partitionKeyName, KeyType: "HASH" },
          { AttributeName: DYNAMODB_INDEXES.GSI20.sortKeyName, KeyType: "RANGE" },
        ]
      },
      ]
    },
  ],
  basePort: 8000,
};