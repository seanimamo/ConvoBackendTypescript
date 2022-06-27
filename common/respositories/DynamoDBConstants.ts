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
    sortKeyName: "GSI4SKEY",
    indexName: "GSI4"
  }

  static readonly GSI5: DynamoDbIndex = {
    partitionKeyName: "GSI5PKEY",
    sortKeyName: "GSI5SKEY",
    indexName: "GSI5"
  }

  static readonly GSI6: DynamoDbIndex = {
    partitionKeyName: "GSI6PKEY",
    sortKeyName: "GSI6SKEY",
    indexName: "GSI6"
  }

  static readonly GSI7: DynamoDbIndex = {
    partitionKeyName: "GSI7PKEY",
    sortKeyName: "GSI7SKEY",
    indexName: "GSI7"
  }

  static readonly GSI8: DynamoDbIndex = {
    partitionKeyName: "GSI8PKEY",
    sortKeyName: "GSI8SKEY",
    indexName: "GSI8"
  }

  static readonly GSI9: DynamoDbIndex = {
    partitionKeyName: "GSI9PKEY",
    sortKeyName: "GSI9SKEY",
    indexName: "GSI9"
  }

  static readonly GSI10: DynamoDbIndex = {
    partitionKeyName: "GSI10PKEY",
    sortKeyName: "GSI10SKEY",
    indexName: "GSI10"
  }

  static readonly GSI11: DynamoDbIndex = {
    partitionKeyName: "GSI11PKEY",
    sortKeyName: "GSI11SKEY",
    indexName: "GSI11"
  }

  static readonly GSI12: DynamoDbIndex = {
    partitionKeyName: "GSI12PKEY",
    sortKeyName: "GSI12SKEY",
    indexName: "GSI12"
  }

  static readonly GSI13: DynamoDbIndex = {
    partitionKeyName: "GSI13PKEY",
    sortKeyName: "GSI13SKEY",
    indexName: "GSI13"
  }

  static readonly GSI14: DynamoDbIndex = {
    partitionKeyName: "GSI14PKEY",
    sortKeyName: "GSI14SKEY",
    indexName: "GSI14"
  }

  static readonly GSI15: DynamoDbIndex = {
    partitionKeyName: "GSI15PKEY",
    sortKeyName: "GSI15SKEY",
    indexName: "GSI15"
  }

  static readonly GSI16: DynamoDbIndex = {
    partitionKeyName: "GSI16PKEY",
    sortKeyName: "GSI16SKEY",
    indexName: "GSI16"
  }

  static readonly GSI17: DynamoDbIndex = {
    partitionKeyName: "GSI17PKEY",
    sortKeyName: "GSI17SKEY",
    indexName: "GSI17"
  }

  static readonly GSI18: DynamoDbIndex = {
    partitionKeyName: "GSI18PKEY",
    sortKeyName: "GSI18SKEY",
    indexName: "GSI18"
  }

  static readonly GSI19: DynamoDbIndex = {
    partitionKeyName: "GSI19PKEY",
    sortKeyName: "GSI19SKEY",
    indexName: "GSI19"
  }

  static readonly GSI20: DynamoDbIndex = {
    partitionKeyName: "GSI20PKEY",
    sortKeyName: "GSI20SKEY",
    indexName: "GSI20"
  }
}