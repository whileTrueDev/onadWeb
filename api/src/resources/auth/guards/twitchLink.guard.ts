import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwitchLinkGuard extends AuthGuard('twitch-link') {}
