import * as ecs from '@aws-cdk/aws-ecs';

export interface TaskInformations {
  taskDefinition: ecs.FargateTaskDefinition;
  container: ecs.ContainerDefinition;
}
