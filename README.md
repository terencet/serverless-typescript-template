# serverless-typescript-template

I didn't want to just provide a template without showing the steps in which how the template came about.

References:

http://gregshackles.com/getting-started-with-serverless-and-typescript/

https://templecoding.com/blog/2016/02/02/how-to-setup-testing-using-typescript-mocha-chai-sinon-karma-and-webpack/

## Commands to run to set things up
```
npm install -g serverless
serverless create --template aws-nodejs --path pup-movies-api
npm init
npm install serverless -save-dev
npm install aws-bluebird -save
npm i --save-dev typescript webpack ts-loader serverless-webpack
```

### Add the following block of code in package.json
```
{
  "name": "pup-movies-api",
  "version": "1.0.0",
  "description": "pup movies rental",
  "author": "",
  "scripts": {
    "deploy": "bash deployment/deploy.sh",
    "test": "jasmine"
  },
  "license": "ISC",
  "devDependencies": {
    "serverless": "^1.14.0"
  },
  "dependencies": {
    "aws-bluebird": "^1.0.0"
  }
}
```

### Create a folder deployment and create a new file call deploy.sh

Edit deploy.sh and add the following content
```
#!/bin/bash

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export AWS_REGION=ap-southeast-2

serverless deploy
```

### Commit the change and run the following command

```
git update-index --chmod=+x deploy.sh
```

### Create the following webpack config - webpack.config.js
```
var path = require('path');

module.exports = { 
  entry: './handler.ts',
  target: 'node',
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '']
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'handler.js'
  },
};
```

### Create a new typescript config file - tsconfig.json
```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs"
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

### Update serverless.yml with the following
```
# Welcome to Serverless!
#
# This file is the main config file for your service.
# It's very minimal at this point and uses default values.
# You can always add more config options for more control.
# We've included some commented out config examples here.
# Just uncomment any of them to get that config option.
#
# For full config options, check the docs:
#    docs.serverless.com
#
# Happy Coding!

service: pup-movies-api

# You can pin your service to only deploy with a specific Serverless version
# Check out our docs for more details
# frameworkVersion: "=X.X.X"

provider:
  name: aws
  runtime: nodejs6.10

plugins:
  - serverless-webpack

# you can overwrite defaults here
#  stage: dev
#  region: us-east-1

# you can add statements to the Lambda function's IAM Role here
#  iamRoleStatements:
#    - Effect: "Allow"
#      Action:
#        - "s3:ListBucket"
#      Resource: { "Fn::Join" : ["", ["arn:aws:s3:::", { "Ref" : "ServerlessDeploymentBucket" } ] ]  }
#    - Effect: "Allow"
#      Action:
#        - "s3:PutObject"
#      Resource:
#        Fn::Join:
#          - ""
#          - - "arn:aws:s3:::"
#            - "Ref" : "ServerlessDeploymentBucket"
#            - "/*"

# you can define service wide environment variables here
#  environment:
#    variable1: value1

# you can add packaging information here
#package:
#  include:
#    - include-me.js
#    - include-me-dir/**
#  exclude:
#    - exclude-me.js
#    - exclude-me-dir/**

functions:
  hello:
    handler: handler.hello

#    The following are a few example events you can configure
#    NOTE: Please make sure to change your handler code to work with those events
#    Check the event documentation for details
#    events:
#      - http:
#          path: users/create
#          method: get
#      - s3: ${env:BUCKET}
#      - schedule: rate(10 minutes)
#      - sns: greeter-topic
#      - stream: arn:aws:dynamodb:region:XXXXXX:table/foo/stream/1970-01-01T00:00:00.000
#      - alexaSkill
#      - iot:
#          sql: "SELECT * FROM 'some_topic'"
#      - cloudwatchEvent:
#          event:
#            source:
#              - "aws.ec2"
#            detail-type:
#              - "EC2 Instance State-change Notification"
#            detail:
#              state:
#                - pending
#      - cloudwatchLog: '/aws/lambda/hello'

#    Define function environment variables here
#    environment:
#      variable2: value2

# you can add CloudFormation resource templates here
#resources:
#  Resources:
#    NewResource:
#      Type: AWS::S3::Bucket
#      Properties:
#        BucketName: my-new-bucket
#  Outputs:
#    NewOutput:
#      Description: "Description for the output"
#      Value: "Some output value"
```

### Rename handler.js to handler.ts

Run the following to test
```
sls webpack invoke -f hello -p event.json
sls webpack serve
sls deploy
```

### Adding Tests

Run the following command

```
npm install typescript webpack ts-loader chai karma karma-chai karma-mocha karma-phantomjs-launcher karma-sinon karma-typescript-preprocessor2 karma-webpack mocha phantomjs-prebuilt sinon --save-dev
```

Create karma.config.js with the following content
```
var webpackConfig = require('./webpack.config');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            'test/*.spec.ts'
        ],
        exclude: [
        ],
        preprocessors: {
            'test/**/*.spec.ts': ['webpack']
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    })
}
```

Create a new test folder and a new file handlers.spec.ts with the following content
```
import { hello } from '../src/handlers';
import * as chai from 'chai';
import {} from 'jasmine';
const expect = chai.expect;

describe('hello function', () => {
    it('processes the query string', done => {
        const requestEvent = {
            method: 'GET',
            query: {
                foo: 'bar'
            }
        };

        hello(requestEvent, {}, (err, result) => {
            expect(err).to.be.undefined;
            expect(result.event).to.equal(requestEvent);
            expect(result.message).to.equal('Method: GET, Param: bar');

            done();
        });
    });
});
```

Install tsd and type definitions
```
npm install typings -g
npm install --save-dev @types/jasmine
typings i --save dt~mocha --global 
typings i --save chai
```

In the command prompt, type the following
```
npm run test
```






