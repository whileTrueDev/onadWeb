import { IsArray } from 'class-validator';

export interface CreateLandingUrlDtoLinkObj {
  primary: boolean;
  linkName: string;
  linkTo: string;
}

export class CreateLandingUrlDto {
  @IsArray()
  links: CreateLandingUrlDtoLinkObj[];
}
