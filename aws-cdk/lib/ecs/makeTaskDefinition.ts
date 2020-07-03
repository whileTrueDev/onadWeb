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
  containerPort?: number | number[],
  memory = 512,
  cpu = 256,
): {
  taskDefinition: ecs.FargateTaskDefinition;
  container: ecs.ContainerDefinition;
} {
  const taskDefinition = new ecs.FargateTaskDefinition(
    scope,
    `${name}TaskDef`,
    {
      memoryLimitMiB: memory, cpu, taskRole, family: `${name}`
    }
  );
  const LogGroup = new logs.LogGroup(scope, `${name}LogGroup`, {
    logGroupName: `ecs/${name}`, removalPolicy: cdk.RemovalPolicy.DESTROY
  });
  const LogDriver = new ecs.AwsLogDriver({
    logGroup: LogGroup, streamPrefix: 'ecs'
  });
  const container = taskDefinition.addContainer(
    `${name}`, {
      image: ecs.ContainerImage.fromRegistry(imageRepo),
      secrets,
      logging: LogDriver,
    }
  );
  if (containerPort) {
    if (containerPort instanceof Array) {
      containerPort.forEach((port) => {
        container.addPortMappings({ containerPort: port });
      });
    } else {
      container.addPortMappings({ containerPort });
    }
  }

  return {
    taskDefinition,
    container
  };
}
