import { DynamoDB } from "aws-sdk";
const DynamoDbLocal = require('dynamodb-local');
const dynamoLocalPort = 8000;

// const isTest = process.env.JEST_WORKER_ID;
// const config = {
//   convertEmptyValues: true,
//   ...(isTest && {
//     endpoint: 'localhost:8000',
//     sslEnabled: false,
//     region: 'local-env',
//   }),
// };

// const dynamodb = new DynamoDB({
//   region: "local",
//   endpoint: "http://localhost:8000"
// });

// afterAll(() => {
//   dynamodb.destroy
// });

// describe("Test Dy7namo", () => {

//   test("Check that transforming the class to and from plain json does not change any data", async () => {
//     const respo = await dynamodb.listTables();
//     console.log("respo", respo);
//   });



// });
 
//@ts-ignore
let childProcess;
let dynamodb: DynamoDB;

beforeAll(async () => {
  childProcess = await DynamoDbLocal.launch(dynamoLocalPort, null, [], false, true);
  console.log("Started dynamo locally");
  
  dynamodb = new DynamoDB({
    region: "local",
    endpoint: "http://localhost:8000"
  });

  const params = {
    TableName: "Scranton",
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  await dynamodb.createTable(params);
});

afterAll(async() => {
  //@ts-ignore
  await DynamoDbLocal.stopChild(childProcess);
})


describe("Test Dynamo", () => {
  test("Test querying local dynamodb table", async () => {
    const resp = await dynamodb.listTables();
    console.log('completed', resp);
  });
});