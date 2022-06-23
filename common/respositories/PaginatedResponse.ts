import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { DynamoDbIndex } from "./DynamoDBConstants";


export type QueryHint = {
  index: DynamoDbIndex
};

export class PaginatedResponse<T> {
  data: T;
  paginationToken: Record<string, AttributeValue> | null;
  queryHint?: QueryHint;

  constructor(data: T,
    paginationToken: Record<string, AttributeValue> | null = null,
    queryHint: QueryHint | undefined = undefined
  ) {
    this.data = data;
    this.paginationToken = paginationToken;
    this.queryHint = queryHint;
  }
}