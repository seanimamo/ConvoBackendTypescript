# Convo Backend Typescript Package

This package contains both aws cdk infrastructure AND typescript backend logic for Convo.
Running `cdk synth` will compile the backend typescript components and package them for deployment

## Packages
* api
* aws-cdk - infrastructure for convo
* common - common objects and methods for convo

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
