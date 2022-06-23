export type DynamoDbIndex = {
  partitionKeyName: string;
  sortKeyName: string;
  indexName?: string;
}

/**
 * Enum for dynamodb indexes (Typescript only supports numerical or string based enums.) 
 */
export class DYNAMODB_INDEXES {
  static readonly PRIMARY: DynamoDbIndex = {
    partitionKeyName: "PKEY",
    sortKeyName: "SKEY",
  };
  
  static readonly GSI1: DynamoDbIndex = {
    partitionKeyName: "GSI1PKEY",
    sortKeyName: "GSI1SKEY",
    indexName: "GSI1"
  }
  
  static readonly GSI2: DynamoDbIndex = {
    partitionKeyName: "GSI2PKEY",
    sortKeyName: "GSI2SKEY",
    indexName: "GSI2"
  }

  static readonly GSI3: DynamoDbIndex = {
    partitionKeyName: "GSI3PKEY",
    sortKeyName: "GSI3SKEY",
    indexName: "GSI3"
  }

  static readonly GSI4: DynamoDbIndex = {
    partitionKeyName: "GSI4PKEY",
    sortKeyName: "GSI41SKEY",
    indexName: "GSI4"
  }

  static readonly GSI5: DynamoDbIndex = {
    partitionKeyName: "GSI5PKEY",
    sortKeyName: "GSI5SKEY",
    indexName: "GSI5"
  }
}