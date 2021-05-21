import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PreCreatorTwitchAuthGuard extends AuthGuard('twitch-pre-creator') {}
