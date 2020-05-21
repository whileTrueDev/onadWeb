import * as cdk from '@aws-cdk/core';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
// import * as route53 from '@aws-cdk/aws-route53';
// import * as alias from '@aws-cdk/aws-route53-targets';
// import * as events from '@aws-cdk/aws-events';
// import * as targets from '@aws-cdk/aws-events-targets';
import * as acm from '@aws-cdk/aws-certificatemanager';

import makeTaskDefinition from './ecs/makeTaskDefinition';
import getParams from './get-ssm-params/getParams';

const DOMAIN = 'onad.io';

export default class OnADTestAwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // *********************************************
    // Define VPC

    const myVpc = new ec2.Vpc(this, 'OnAdTestVpc');

    // *********************************************
    // Make Security groups

    // empty security group
    const emptySecGrp = new ec2.SecurityGroup(this, 'emptySecurityGroup', {
      vpc: myVpc,
      securityGroupName: 'OnADEmptySecurityGroup',
      allowAllOutbound: true,
    });
    // React
    const onadWebSecGrp = new ec2.SecurityGroup(this, 'reactSecurityGroup', {
      vpc: myVpc,
      securityGroupName: 'OnADReact-test-SecurityGroup',
      allowAllOutbound: true
    });
    onadWebSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(3001));
    // API
    const onadWebApiSecGrp = new ec2.SecurityGroup(this, 'APISecurityGroup', {
      vpc: myVpc,
      securityGroupName: 'OnADAPI-test-SecurityGroup',
      allowAllOutbound: true
    });
    onadWebApiSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(3000));
    // Ad Broad
    const bannerBroadSecGrp = new ec2.SecurityGroup(this, 'bannerBroadSecurityGroup', {
      vpc: myVpc,
      securityGroupName: 'OnADAdBaord-test-SecurityGroup',
      allowAllOutbound: true
    });
    bannerBroadSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(3002));
    // Trakcer
    const trackerSecGrp = new ec2.SecurityGroup(this, 'trackerSecurityGroup', {
      vpc: myVpc,
      securityGroupName: 'OnADAdTracker-test-SecurityGroup',
      allowAllOutbound: true
    });
    trackerSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(3030));

    // *********************************************
    // Create IAM Role for Fargate task, CloudWatch

    const onadTaskRole = new iam.Role(this, 'ecsTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
    });
    // Add ecs task execution policy to role
    onadTaskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
    );
    // Add custom policy to role for read ssm parameter
    onadTaskRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [`arn:aws:ssm:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:parameter/*`],
        actions: ['ssm:GetParameters']
      })
    );

    // *********************************************
    // Define ECS Cluster

    const myCluster = new ecs.Cluster(this, 'OnADCluster',
      { vpc: myVpc, clusterName: 'OnAD-Test' });

    // *********************************************
    // Get params from SSM Parameter Store

    const ssmParameters = getParams(this);

    // *********************************************
    // Create Task Definitions, CloudWatch LogGroups

    // React - Task definition
    const onadClientRepo = 'hwasurr/onad_web';
    const onadClientPort = 3001;
    const onadClientName = 'TEST-onad-web';
    const onadWeb = makeTaskDefinition(this, onadClientName, onadClientRepo, onadTaskRole, {
      REACT_APP_REACT_HOSTNAME: ecs.Secret.fromSsmParameter(ssmParameters.TEST_REACT_HOSTNAME),
      REACT_APP_API_HOSTNAME: ecs.Secret.fromSsmParameter(ssmParameters.TEST_API_HOSTNAME),
      REACT_APP_GOOGLE_MAP_API_KEY: ecs.Secret.fromSsmParameter(ssmParameters.GOOGLE_MAP_API_KEY),
    }, onadClientPort);

    // API - Task definition
    const onadApiRepo = 'hwasurr/onad_web_api';
    const onadApiPort = 3000;
    const onadApiName = 'TEST-onad-web-api';
    const onadApi = makeTaskDefinition(this, onadApiName, onadApiRepo, onadTaskRole, {
      REACT_HOSTNAME: ecs.Secret.fromSsmParameter(ssmParameters.TEST_REACT_HOSTNAME),
      API_HOSTNAME: ecs.Secret.fromSsmParameter(ssmParameters.TEST_API_HOSTNAME),
      DB_CHARSET: ecs.Secret.fromSsmParameter(ssmParameters.DB_CHARSET),
      DB_HOST: ecs.Secret.fromSsmParameter(ssmParameters.DB_HOST),
      DB_PASSWORD: ecs.Secret.fromSsmParameter(ssmParameters.DB_PASSWORD),
      DB_PORT: ecs.Secret.fromSsmParameter(ssmParameters.DB_PORT),
      DB_USER: ecs.Secret.fromSsmParameter(ssmParameters.DB_USER),
      DB_DATABASE: ecs.Secret.fromSsmParameter(ssmParameters.DB_DATABASE),
      TWITCH_CLIENT_ID: ecs.Secret.fromSsmParameter(ssmParameters.TWITCH_CLIENT_ID),
      TWITCH_CLIENT_SECRET: ecs.Secret.fromSsmParameter(ssmParameters.TWITCH_CLIENT_SECRET),
      SESSION_STORE_DB_HOST: ecs.Secret.fromSsmParameter(ssmParameters.SESSION_STORE_DB_HOST),
      SESSION_STORE_DB_USER: ecs.Secret.fromSsmParameter(ssmParameters.SESSION_STORE_DB_USER),
      SESSION_STORE_DB_PASSWORD: ecs.Secret.fromSsmParameter(ssmParameters.SESSION_STORE_DB_PASSWORD),
      SESSION_STORE_DB_DATABASE: ecs.Secret.fromSsmParameter(ssmParameters.SESSION_STORE_DB_DATABASE),
      SESSION_STORE_DB_PORT: ecs.Secret.fromSsmParameter(ssmParameters.SESSION_STORE_DB_PORT),
      SLACK_ALARM_URL: ecs.Secret.fromSsmParameter(ssmParameters.SLACK_ALARM_URL),
      NAVER_CLOUD_ACCESS_KEY: ecs.Secret.fromSsmParameter(ssmParameters.NAVER_CLOUD_ACCESS_KEY),
      NAVER_CLOUD_SECRET_KEY: ecs.Secret.fromSsmParameter(ssmParameters.NAVER_CLOUD_SECRET_KEY),
      NAVER_CLOUD_BIZMESSAGE_SERVICE_ID: ecs.Secret.fromSsmParameter(ssmParameters.NAVER_CLOUD_BIZMESSAGE_SERVICE_ID),
      GOOGLE_CLIENT_ID: ecs.Secret.fromSsmParameter(ssmParameters.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: ecs.Secret.fromSsmParameter(ssmParameters.GOOGLE_CLIENT_SECRET),
      NAVER_CLIENT_ID: ecs.Secret.fromSsmParameter(ssmParameters.NAVER_CLIENT_ID),
      NAVER_CLIENT_SECRET: ecs.Secret.fromSsmParameter(ssmParameters.NAVER_CLIENT_SECRET),
      KAKAO_CLIENT_ID: ecs.Secret.fromSsmParameter(ssmParameters.KAKAO_CLIENT_ID),
      CIPHER_KEY: ecs.Secret.fromSsmParameter(ssmParameters.CIPHER_KEY),
      CIPHER_IV: ecs.Secret.fromSsmParameter(ssmParameters.CIPHER_IV),
      IMP_KEY: ecs.Secret.fromSsmParameter(ssmParameters.IMP_KEY),
      IMP_SECRET: ecs.Secret.fromSsmParameter(ssmParameters.IMP_SECRET),
      MAIL_ID: ecs.Secret.fromSsmParameter(ssmParameters.MAIL_ID),
      MAIL_PASSWORD: ecs.Secret.fromSsmParameter(ssmParameters.MAIL_PASSWORD),
      AWS_S3_ACCESS_KEY_ID: ecs.Secret.fromSsmParameter(ssmParameters.S3_ACCESS_KEY_ID),
      AWS_S3_ACCESS_KEY_SECRET: ecs.Secret.fromSsmParameter(ssmParameters.S3_ACCESS_KEY_SECRET)
    },
    onadApiPort);

    // Banner broad - Task definition
    const onadBannerBroadRepo = 'hwasurr/onad_socket';
    const onadBannerBroadPort = 3002;
    const onadBannerBroadName = 'TEST-onad-banner-broad';
    const onadBannerBroad = makeTaskDefinition(this, onadBannerBroadName, onadBannerBroadRepo, onadTaskRole, {
      SOCKET_HOSTNAME: ecs.Secret.fromSsmParameter(ssmParameters.TEST_SOCKET_HOSTNAME),
      DB_HOST: ecs.Secret.fromSsmParameter(ssmParameters.DB_HOST),
      DB_USER: ecs.Secret.fromSsmParameter(ssmParameters.DB_USER),
      DB_PASSWORD: ecs.Secret.fromSsmParameter(ssmParameters.DB_PASSWORD),
      DB_DATABASE: ecs.Secret.fromSsmParameter(ssmParameters.DB_DATABASE),
      DB_CHARSET: ecs.Secret.fromSsmParameter(ssmParameters.DB_CHARSET),
      DB_PORT: ecs.Secret.fromSsmParameter(ssmParameters.DB_PORT),
    },
    onadBannerBroadPort);

    // tracker - Task Definition
    const onadTrackerRepo = 'hwasurr/onad_tracker';
    const onadTrackerPort = 3030;
    const onadTrackerName = 'TEST-onad-tracker';
    const onadTracker = makeTaskDefinition(this, onadTrackerName, onadTrackerRepo, onadTaskRole, {
      DB_HOST: ecs.Secret.fromSsmParameter(ssmParameters.DB_HOST),
      DB_USER: ecs.Secret.fromSsmParameter(ssmParameters.DB_USER),
      DB_PASSWORD: ecs.Secret.fromSsmParameter(ssmParameters.DB_PASSWORD),
      DB_DATABASE: ecs.Secret.fromSsmParameter(ssmParameters.DB_DATABASE),
      DB_CHARSET: ecs.Secret.fromSsmParameter(ssmParameters.DB_CHARSET),
      DB_PORT: ecs.Secret.fromSsmParameter(ssmParameters.DB_PORT),
    }, onadTrackerPort);

    // *********************************************
    // Create ECS Service

    // onadWeb
    const onadWebService = new ecs.FargateService(this, `${onadClientName}-Service`, {
      cluster: myCluster,
      serviceName: `${onadClientName}-Service`,
      taskDefinition: onadWeb.taskDefinition,
      assignPublicIp: true,
      desiredCount: 1,
      securityGroup: onadWebSecGrp,
    });
    // onadWebApi
    const onadWebApiService = new ecs.FargateService(this, `${onadApiName}-Service`, {
      cluster: myCluster,
      serviceName: `${onadApiName}-Service`,
      taskDefinition: onadApi.taskDefinition,
      assignPublicIp: true,
      desiredCount: 1,
      securityGroup: onadWebApiSecGrp,
    });
    // banner broad
    const onadBannerBroadService = new ecs.FargateService(
      this, `${onadBannerBroadName}-Service`, {
        cluster: myCluster,
        serviceName: `${onadBannerBroadName}-Service`,
        taskDefinition: onadBannerBroad.taskDefinition,
        assignPublicIp: true,
        desiredCount: 1,
        securityGroup: bannerBroadSecGrp,
      }
    );
    // tracker
    const onadTrackerService = new ecs.FargateService(
      this, `${onadTrackerName}-Service`, {
        cluster: myCluster,
        serviceName: `${onadTrackerName}-Service`,
        taskDefinition: onadTracker.taskDefinition,
        assignPublicIp: true,
        desiredCount: 1,
        securityGroup: trackerSecGrp,
      }
    );

    // *********************************************
    // Create Target groups
    const onadWebGroup = new elbv2.ApplicationTargetGroup(this, 'onadLBonadWebTargetGroup', {
      vpc: myVpc,
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: onadClientPort,
      targets: [onadWebService],
      targetGroupName: `${onadClientName}-Target`,
    });
    const onadWebApiGroup = new elbv2.ApplicationTargetGroup(this, 'onadLBWebApiTargetGroup', {
      vpc: myVpc,
      targetGroupName: `${onadApiName}-Target`,
      port: onadApiPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [onadWebApiService],
    });
    const onadBannerBroadGroup = new elbv2.ApplicationTargetGroup(this, 'onadLBBannerBroadTargetGroup', {
      vpc: myVpc,
      targetGroupName: `${onadBannerBroadName}-Target`,
      port: onadBannerBroadPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [onadBannerBroadService],
    });
    const onadTrackerGroup = new elbv2.ApplicationTargetGroup(this, 'onadLBTrackerTargetGroup', {
      vpc: myVpc,
      targetGroupName: `${onadTrackerName}-Target`,
      port: onadTrackerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [onadTrackerService],
    });

    // *********************************************
    // Route53 ALB, subdomain 등록

    // Add Hosted zone
    // const onadHostzone = route53.HostedZone.fromHostedZoneAttributes(
    //   this, `find${DOMAIN}Zone`, {
    //     zoneName: DOMAIN,
    //     hostedZoneId: process.env.AWS_HOSTEDZONE_ID!,
    //   }
    // );

    // *********************************************
    // Get DNS validated Certificates

    const sslcert = acm.Certificate.fromCertificateArn(
      this, 'DnsCertificate',
      process.env.AWS_SSL_CERTIFICATE_ARN!
    );

    // *********************************************
    // Create ALB (Application Loadbalencer)

    const onadLoadBalancer = new elbv2.ApplicationLoadBalancer(this, 'OnADLB', {
      vpc: myVpc, internetFacing: true, loadBalancerName: 'OnADio-test-LB'
    });

    // *********************************************
    // Add Http listener to ALB
    const onadHttpListener = onadLoadBalancer.addListener('OnADHttpListener', {
      port: 80,
      defaultTargetGroups: [onadWebGroup]
    });
    onadHttpListener.addRedirectResponse('80to443RedirectTarget', {
      priority: 1,
      pathPattern: '/*',
      statusCode: 'HTTP_301',
      port: '443',
      protocol: elbv2.Protocol.HTTPS
    });
    onadHttpListener.connections.allowDefaultPortFromAnyIpv4('http ALB open to world');

    // *********************************************
    // Add https listener to ALB
    const onadHttpsListener = onadLoadBalancer.addListener('OnADHttpsListener', {
      port: 443,
      // The CloudFormation deployment will wait until this verification process has been completed
      certificates: [sslcert],
      sslPolicy: elbv2.SslPolicy.RECOMMENDED,
      defaultTargetGroups: [onadWebGroup]
    });

    const onadWebHostHeader = `test.${DOMAIN}`;
    onadHttpsListener.addTargetGroups('onadWebTargetGroups', {
      priority: 1,
      targetGroups: [onadWebGroup],
      hostHeader: onadWebHostHeader,
    });

    const onadWebApiHostHeader = `test-api.${DOMAIN}`;
    onadHttpsListener.addTargetGroups('onadWebApiGroup', {
      priority: 2,
      hostHeader: onadWebApiHostHeader,
      targetGroups: [onadWebApiGroup]
    });

    const onadBannerBroadHostHeader = `test-banner.${DOMAIN}`;
    onadHttpsListener.addTargetGroups('onadBannerBroadGroup', {
      priority: 3,
      hostHeader: onadBannerBroadHostHeader,
      targetGroups: [onadBannerBroadGroup],
    });

    const onadTrackerHostHeader = `test-t.${DOMAIN}`;
    onadHttpsListener.addTargetGroups('onadTrackerGroup', {
      priority: 4,
      hostHeader: onadTrackerHostHeader,
      targetGroups: [onadTrackerGroup],

    });
    onadHttpsListener.connections.allowDefaultPortFromAnyIpv4('https ALB open to world');

    // // *********************************************
    // // Route53 ALB, subdomain 등록

    // // Add Loadbalancer ARecord to onadHostZone
    // const onadLoadbalancerRecord = new route53.ARecord(this, 'LoadbalancerARecord', {
    //   zone: onadHostzone,
    //   recordName: `${DOMAIN}.`,
    //   target: route53.RecordTarget.fromAlias(
    //     new alias.LoadBalancerTarget(onadLoadBalancer)
    //   )
    // });

    // const subdomains = [
    //   'test', 'test-t', 'test-api', 'test-banner'
    // ];
    // subdomains.map((subdomain) => new route53.ARecord(this, `subdomain/${subdomain}`, {
    //   zone: onadHostzone,
    //   recordName: `${subdomain}.${DOMAIN}`,
    //   target: route53.RecordTarget.fromAlias(
    //     new alias.LoadBalancerTarget(onadLoadBalancer)
    //   )
    // }));
  }
}
