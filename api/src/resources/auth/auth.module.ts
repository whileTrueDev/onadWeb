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
import { SessionSerializer } from './passport.serializer';

@Module({
  imports: [
    MarketerModule,
    CreatorModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([LoginStamp]),
  ],
  controllers: [AuthController, LoginController],
  providers: [AuthService, SessionSerializer, LocalStrategy, MarketerGoogleStrategy],
})
export class AuthModule {}
