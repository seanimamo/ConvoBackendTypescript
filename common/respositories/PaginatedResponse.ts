import { AttributeValue } from "@aws-sdk/client-dynamodb";

export class PaginatedResponse<T> {
  data: T;
  paginationToken: Record<string, AttributeValue> | null;

  constructor(data: T, paginationToken: Record<string, AttributeValue> | null = null) {
    this.data = data;
    this.paginationToken = paginationToken;
  }
}