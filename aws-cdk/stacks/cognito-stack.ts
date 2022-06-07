import { Stack, StackProps } from 'aws-cdk-lib';
import { AccountRecovery, CfnUserPool, Mfa, StringAttribute, UserPool, UserPoolOperation, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { Stage } from '../util/Stage';
import { createStageBasedId } from '../util/cdkUtils';

type ConvoCognitoStackProps = {
  stage: Stage,
  convoDynamoMainTableName: string,
  convoMainDynamoTableArn: string,
} & StackProps;

export class ConvoCognitoStack extends Stack {
  stage: Stage;
  userPool: UserPool;
  convoDynamoMainTableName: string
  convoMainDynamoTableArn: string;

  constructor(scope: Construct, id: string, props: ConvoCognitoStackProps) {
    super(scope, id, props);

    this.stage = props.stage;
    this.convoDynamoMainTableName = props.convoDynamoMainTableName;
    this.convoMainDynamoTableArn = props.convoMainDynamoTableArn;

    const cognitoUserPool = this.createCognitoUserPool();
    this.addUserPoolLambdaTriggers(cognitoUserPool);
    this.createUserPoolUIClient(cognitoUserPool)
  }
  
  createCognitoUserPool() {
    const userPoolName = createStageBasedId(this.stage, 'ConvoCognitoUserPool');
    const cognitoUserPool = new UserPool(this, userPoolName, {
      userPoolName: userPoolName,
      signInAliases: {
        username: true,
        email: true,
        phone: false
      },
      signInCaseSensitive: false,
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 8,
        requireDigits: false,
        requireLowercase: false,
        requireUppercase: false,
        requireSymbols: false
      },
      enableSmsRole: true,
      autoVerify: {
        email: true
      },
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK,
        emailSubject: 'Your Convo Account Verification Link',
        emailBody: 'Welcome to Convo! Please click this link to verify your account: {##Verify Email##}'
      },
      customAttributes: {
        firstName: new StringAttribute({
          mutable: true
        }),
        lastName: new StringAttribute({
          mutable: true
        }),
      },
      accountRecovery: AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA,
      mfa: Mfa.OPTIONAL
    });

    cognitoUserPool.addDomain(createStageBasedId(this.stage, "ConvoCognitoUserPoolDomain"),
      {
        cognitoDomain: {
          domainPrefix: this.stage === Stage.PROD ? 'convo' : createStageBasedId(this.stage, "convo").toLowerCase()
        }
      }
    );

    const cfnUserPool = cognitoUserPool.node.defaultChild as CfnUserPool;

    cfnUserPool.emailConfiguration = {
      emailSendingAccount: "DEVELOPER",
      from: "no-reply@convo.video",
      sourceArn: "arn:aws:ses:us-east-1:579960896624:identity/no-reply@convo.video"
    };

    cfnUserPool.deviceConfiguration = {
      deviceOnlyRememberedOnUserPrompt: true
    };

    return cognitoUserPool;
  }

  createUserPoolUIClient(cognitoUserPool: UserPool) {
    cognitoUserPool.addClient(createStageBasedId(this.stage, "ConvoCognitoUserPoolClient"), {
      userPoolClientName: createStageBasedId(this.stage, "ConvoCognitoUserPoolClient"),
      generateSecret: false,
      authFlows: {
        userSrp: true,
        userPassword: true,
        custom: true
      },
      preventUserExistenceErrors: true
    });
  }

  addUserPoolLambdaTriggers(cognitoUserPool: UserPool) {
    const preSignUpLambdaTrigger = new NodejsFunction(this, createStageBasedId(this.stage, "ConvoCognitoPreSignUpTrigger"), {
      runtime: Runtime.NODEJS_16_X,
      functionName: createStageBasedId(this.stage, "ConvoCognitoPreSignUpTrigger", true),
      entry: path.join(__dirname, `../../api/aws-lambda/cognito/PreSignUpLambdaTrigger.ts`),
      handler: "preSignUpLambdaTrigger_handleRequest",
      architecture: Architecture.ARM_64,
      memorySize: 1024, // This memory amount is overkill but will minimize cold start time
      environment: {
        'DYNAMO_MAIN_TABLE_NAME': this.convoDynamoMainTableName
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ['dynamodb:PutItem', 'dynamodb:Query'],
          effect: Effect.ALLOW,
          resources: [this.convoMainDynamoTableArn]
        })
      ],
      bundling: {
        minify: true,
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
        esbuildArgs: { // Pass additional arguments to esbuild
          // "--analyze": true
        },
      }
    }

    );
    cognitoUserPool.addTrigger(UserPoolOperation.PRE_SIGN_UP, preSignUpLambdaTrigger);

    const postConfirmationLambdaTrigger = new NodejsFunction(this, createStageBasedId(this.stage, "ConvoPostConfirmationTrigger"), {
      runtime: Runtime.NODEJS_16_X,
      functionName: createStageBasedId(this.stage, "ConvoCognitoPostConfirmationTrigger"),
      entry: path.join(__dirname, `../../api/aws-lambda/cognito/PostConfirmationLambdaTrigger.ts`),
      handler: "postConfirmationLambdaTrigger_handleRequest",
      architecture: Architecture.ARM_64,
      memorySize: 1024,
      environment: {
        'DYNAMO_MAIN_TABLE_NAME': this.convoDynamoMainTableName
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ['dynamodb:UpdateItem', 'dynamodb:Query'],
          effect: Effect.ALLOW,
          resources: [this.convoMainDynamoTableArn]
        })
      ],
      bundling: {
        minify: true,
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
        esbuildArgs: { // Pass additional arguments to esbuild
          // "--analyze": true,
        },
      },
    });
    cognitoUserPool.addTrigger(UserPoolOperation.POST_CONFIRMATION, postConfirmationLambdaTrigger);
  }
}
