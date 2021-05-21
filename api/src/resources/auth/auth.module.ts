import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreatorModule } from '../creator/creator.module';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginController } from './login.controller';
import { LoginStamp } from '../../entities/LoginStamp';
import { MarketerModule } from '../marketer/marketer.module';
import { MarketerGoogleStrategy } from './strategies/marketerGoogle.strategy';
import { SessionSerializer } from './strategies/passport.serializer';
import { PreCreatorTwitchStrategy } from './strategies/preCreatorTwitch.strategy';
import { TwitchLinkStrategy } from './strategies/creatorTwitchLink.strategy';
import { LinkController } from './link.controller';
import { TwitchApiModule } from '../../api/twitch-api/twitch-api.module';
import { LogoutController } from './logout.controller';
import { MarketerNaverStrategy } from './strategies/marketerNaver.strategy';
import { MarketerKakaoStrategy } from './strategies/marketerKakao.strategy';
import { LinkService } from './link.service';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { AfreecaLinkCertification } from '../../entities/AfreecaLinkCertification';

@Module({
  imports: [
    MarketerModule,
    CreatorModule,
    TwitchApiModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([LoginStamp, CreatorInfo, AfreecaLinkCertification]),
  ],
  controllers: [AuthController, LoginController, LogoutController, LinkController],
  providers: [
    AuthService,
    LinkService,
    SessionSerializer,
    LocalStrategy,
    MarketerGoogleStrategy,
    MarketerNaverStrategy,
    MarketerKakaoStrategy,
    PreCreatorTwitchStrategy,
    TwitchLinkStrategy,
  ],
})
export class AuthModule {}
