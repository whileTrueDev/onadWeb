import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitchApiModule } from '../../api/twitch-api/twitch-api.module';
import { AfreecaLinkCertification } from '../../entities/AfreecaLinkCertification';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { LoginStamp } from '../../entities/LoginStamp';
import { CreatorModule } from '../creator/creator.module';
import { MarketerModule } from '../marketer/marketer.module';
import { LinkController } from './auth-link/link.controller';
import { LinkService } from './auth-link/link.service';
import { AuthService } from './auth.service';
import { LoginController } from './login.controller';
import { LogoutController } from './logout.controller';
import { TwitchLinkStrategy } from './auth-link/creatorTwitchLink.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { MarketerGoogleStrategy } from './strategies/marketerGoogle.strategy';
import { MarketerKakaoStrategy } from './strategies/marketerKakao.strategy';
import { MarketerNaverStrategy } from './strategies/marketerNaver.strategy';
import { SessionSerializer } from './strategies/passport.serializer';
import { PreCreatorTwitchStrategy } from './strategies/preCreatorTwitch.strategy';

@Module({
  imports: [
    MarketerModule,
    CreatorModule,
    TwitchApiModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([LoginStamp, CreatorInfo, AfreecaLinkCertification]),
  ],
  controllers: [LoginController, LogoutController, LinkController],
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
