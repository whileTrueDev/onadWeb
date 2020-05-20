import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';

export default function makeService(
  scope: cdk.Construct,
  name: string,
  cluster: ecs.Cluster,
  taskDefinition: ecs.TaskDefinition,
  props: Omit<ecs.FargateServiceProps, 'cluster' | 'taskDefinition'>
): ecs.FargateService {
  return new ecs.FargateService(scope, `${name}Service`, {
    cluster,
    taskDefinition,
    ...props
  });
}
