import { IsIn, IsString } from 'class-validator';

export class FindManualDto {
  @IsString()
  @IsIn(['creator', 'marketer'])
  type: 'creator' | 'marketer';
}
