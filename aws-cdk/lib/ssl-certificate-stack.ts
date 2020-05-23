import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';

const DOMAIN = 'hwasurr.io';

export default class SslCertificateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sslcert = acm.Certificate.fromCertificateArn(
      this, 'DnsCertificate',
      `arn:aws:acm:ap-northeast-2:${cdk.Aws.ACCOUNT_ID}:certificate/1b0e16d0-792b-44e9-b289-a00fe8c6d4b8`
    );

    // console.log(cdk.Aws.ACCOUNT_ID);

    // console.log(sslcert);
  }
}
