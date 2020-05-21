import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';

export default function makeTaskDefinition(
  scope: cdk.Construct,
  name: string,
  imageRepo: string,
  taskRole: iam.Role,
  secrets: {
    [key: string]: ecs.Secret;
  },
  containerPort?: number,
): {
  taskDefinition: ecs.FargateTaskDefinition;
  container: ecs.ContainerDefinition;
} {
  const taskDefinition = new ecs.FargateTaskDefinition(
    scope,
    `${name}TaskDef`,
    { memoryLimitMiB: 512, cpu: 256, taskRole }
  );
  const LogGroup = new logs.LogGroup(scope, `${name}LogGroup`, {
    logGroupName: `ecs/${name}LogGroup`, removalPolicy: cdk.RemovalPolicy.DESTROY
  });
  const LogDriver = new ecs.AwsLogDriver({
    logGroup: LogGroup, streamPrefix: 'ecs'
  });
  const container = taskDefinition.addContainer(
    `${name}Container`, {
      image: ecs.ContainerImage.fromRegistry(imageRepo),
      secrets,
      logging: LogDriver
    }
  );
  if (containerPort) {
    container.addPortMappings({ containerPort });
  }

  return {
    taskDefinition,
    container
  };
}
