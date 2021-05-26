import { IsNumber } from 'class-validator';

export class UpdateMarketerNotificationReadStateDto {
  @IsNumber()
  index: number | string;
}
