#!/usr/bin/env node
/* eslint-disable no-new */
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from '@aws-cdk/core';
// import OnADProductionAwsStack from '../lib/production-stack';
import OnADTestAwsStack from '../lib/test-stack';
import LiveCommerceStack from '../lib/live-commerce-stack';

dotenv.config();

const app = new cdk.App();

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


new LiveCommerceStack(app, 'OnADLiveCommerceStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_ONAD_REGION,
  }
});
