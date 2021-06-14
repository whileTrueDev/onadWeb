import { IsIn, IsString } from 'class-validator';

export class UpdateMarketerInfoDto {
  @IsIn(['password', 'name', 'phone', 'mail', 'profileImage'])
  type: 'password' | 'name' | 'phone' | 'mail' | 'profileImage';

  @IsString()
  value: string;
}
