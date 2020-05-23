#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from '@aws-cdk/core';
// import OnADProductionAwsStack from '../lib/production-stack';
import OnADTestAwsStack from '../lib/test-stack';

dotenv.config();

const app = new cdk.App();

// ((): OnADProductionAwsStack => new OnADProductionAwsStack(
//   app,
//   'OnADProductionAwsStack',
//   {
//     env: {
//       account: cdk.Aws.ACCOUNT_ID,
//       region: process.env.AWS_ONAD_REGION
//     }
//   }
// ))();

((): OnADTestAwsStack => new OnADTestAwsStack(
  app,
  'OnADTestAwsStack',
  {
    env: {
      account: cdk.Aws.ACCOUNT_ID,
      region: process.env.AWS_ONAD_REGION
    }
  }
))();
