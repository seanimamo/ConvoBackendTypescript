import { Handler } from "aws-cdk-lib/aws-lambda"
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda"

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    headers: {},
    body: `${event.pathParameters!['parameter']}`,
  }
  return response;
} 