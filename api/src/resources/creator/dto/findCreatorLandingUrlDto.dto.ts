import { IsIn } from 'class-validator';

export class FindCreatorLandingUrlDto {
  @IsIn(['twitch', 'afreeca'])
  type: 'twitch' | 'afreeca';
}
