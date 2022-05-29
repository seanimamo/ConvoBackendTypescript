import { Handler } from "aws-cdk-lib/aws-lambda"

export const handler: Handler = async (event: any, context: any) => {
  return {
    statusCode: 200,
    headers: {},
    body: "your moms very nice",
  }
}