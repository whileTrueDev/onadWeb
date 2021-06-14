import { IsBoolean } from 'class-validator';

export class ChangeOnOffStateDto {
  @IsBoolean()
  onOffState: boolean;
}
