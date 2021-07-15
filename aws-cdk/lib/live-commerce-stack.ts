import * as ec2 from '@aws-cdk/aws-ec2';
import { Vpc } from '@aws-cdk/aws-ec2';
import {
  AwsLogDriver,
  Cluster,
  ContainerImage,
  FargateService,
  FargateTaskDefinition,
  Secret,
} from '@aws-cdk/aws-ecs';
import {
  ApplicationListener,
  ApplicationLoadBalancer,
  ApplicationProtocol,
  ApplicationTargetGroup,
} from '@aws-cdk/aws-elasticloadbalancingv2';
import { Role } from '@aws-cdk/aws-iam';
import { LogGroup } from '@aws-cdk/aws-logs';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { LoadBalancerTarget } from '@aws-cdk/aws-route53-targets';
import * as cdk from '@aws-cdk/core';
import getParams from './get-ssm-params/getParams';

const DOMAIN = 'livecommerce.onad.io';
const PORT = 3060;
const PREFIX = 'LiveCommerce';
const REPO_NAME = 'onad_live-commerce';

export default class LiveCommerceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.checkEnvVariables();

    const onadVpc = Vpc.fromLookup(this, 'FindOnadVpc', {
      vpcName: 'EC2 ONAD default',
    });

    // Find existing ECS Cluster "OnAD"
    const myCluster = Cluster.fromClusterAttributes(this, 'FindECSCluster', {
      clusterName: 'OnAD',
      vpc: onadVpc,
      securityGroups: [],
      clusterArn: process.env.AWS_ONAD_CLUSTER_ARN,
    });

    // Create Security Groups for LiveCommerce
    const liveCommerceSG = new ec2.SecurityGroup(this, 'LiveCommerceSecurityGroup', {
      vpc: onadVpc,
      securityGroupName: 'OnADLiveCommerce-SG',
      allowAllOutbound: true,
    });
    liveCommerceSG.connections.allowFromAnyIpv4(ec2.Port.tcp(PORT));

    // Find IAM Role for Fargate task
    const taskRole = Role.fromRoleArn(this, 'FindECSTaskRole', process.env.AWS_ONAD_TASKROLE_ARN!);

    // Create TaskDefinition for LiveCommerce
    const taskDef = new FargateTaskDefinition(this, `${PREFIX}TaskDef`, {
      cpu: 256,
      memoryLimitMiB: 512,
      taskRole,
      family: REPO_NAME, // match with live-commerce/task-definition.json > "family"
    });
    const logGroup = new LogGroup(this, `${PREFIX}LogGroup`, {
      logGroupName: `ecs/${PREFIX}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Find ssm parameters
    const ssmParameters = getParams(this);

    const container = taskDef.addContainer(PREFIX, {
      image: ContainerImage.fromRegistry(`hwasurr/${REPO_NAME}`),
      logging: new AwsLogDriver({ logGroup, streamPrefix: 'ecs' }),
      secrets: {
        DB_CHARSET: Secret.fromSsmParameter(ssmParameters.DB_CHARSET),
        DB_HOST: Secret.fromSsmParameter(ssmParameters.DB_HOST),
        DB_PASSWORD: Secret.fromSsmParameter(ssmParameters.DB_PASSWORD),
        DB_PORT: Secret.fromSsmParameter(ssmParameters.DB_PORT),
        DB_USER: Secret.fromSsmParameter(ssmParameters.DB_USER),
        DB_DATABASE: Secret.fromSsmParameter(ssmParameters.DB_DATABASE),
        GOOGLE_CREDENTIALS_PRIVATE_KEY: Secret.fromSsmParameter(
          ssmParameters.LIVECOMMERCE_GCP_TTS_PRIVATE_KEY,
        ),
        GOOGLE_CREDENTIALS_EMAIL: Secret.fromSsmParameter(ssmParameters.LIVECOMMERCE_GCP_TTS_EMAIL),
      },
    });
    container.addPortMappings({ containerPort: PORT });

    // Create Fargate Service
    const service = new FargateService(this, `${PREFIX}-Service`, {
      cluster: myCluster,
      serviceName: `${PREFIX}-Service`,
      taskDefinition: taskDef,
      assignPublicIp: true,
      desiredCount: 1,
      securityGroups: [liveCommerceSG],
    });

    // Find OnAD ALB Listener
    const myAlbHTTPSListener = ApplicationListener.fromApplicationListenerAttributes(
      this,
      'FindALBListener',
      {
        listenerArn: process.env.AWS_ONAD_ALB_LISTENER_ARN!,
        securityGroupId: process.env.AWS_ONAD_ALB_SG_ID!,
      },
    );

    // Attach Target groups to existing http listener
    myAlbHTTPSListener.addTargetGroups(`${PREFIX}TargetGroups`, {
      priority: 10,
      hostHeader: DOMAIN,
      targetGroups: [
        new ApplicationTargetGroup(this, `${PREFIX}TargetGroup`, {
          vpc: onadVpc,
          targetGroupName: `${PREFIX}-Target`,
          port: PORT,
          protocol: ApplicationProtocol.HTTP,
          targets: [service],
        }),
      ],
    });

    // Create Domain "livecommerce.onad.io"
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'FindHostedZone', {
      hostedZoneId: process.env.AWS_HOSTEDZONE_ID!,
      zoneName: 'onad.io',
    });

    // Find Onad ALB
    const alb = ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(this, 'FindOnADALB', {
      vpc: onadVpc,
      securityGroupId: process.env.AWS_ONAD_ALB_SG_ID!,
      loadBalancerArn: process.env.AWS_ONAD_ALB_ARN!,
      loadBalancerCanonicalHostedZoneId: process.env.AWS_ONAD_ALB_HOSTEDZONE_ID!,
      loadBalancerDnsName: process.env.AWS_ONAD_ALB_DNS_NAME!,
    });

    const record = new ARecord(this, `${PREFIX}ARecord`, {
      target: RecordTarget.fromAlias(new LoadBalancerTarget(alb)),
      zone: hostedZone,
      recordName: DOMAIN,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private checkEnvVariables(): void {
    const envKeys = Object.keys(process.env);

    const required = [
      'AWS_ONAD_TASKROLE_ARN',
      'AWS_ONAD_ALB_LISTENER_ARN',
      'AWS_HOSTEDZONE_ID',
      'AWS_ONAD_ALB_SG_ID',
      'AWS_ONAD_ALB_ARN',
      'AWS_ONAD_ALB_DNS_NAME',
      'AWS_ONAD_ALB_HOSTEDZONE_ID',
    ];

    required.forEach(key => {
      if (!envKeys.includes(key)) throw new Error(`You need Environment variable - ${key}`);
    });
  }
}
