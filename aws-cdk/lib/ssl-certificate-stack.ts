import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';

const DOMAIN = 'hwasurr.io';

export default class SslCertificateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cert = new acm.Certificate(this, 'Certificate', {
      domainName: DOMAIN
    });
  }
}
