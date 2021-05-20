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

@Module({
  imports: [
    MarketerModule, CreatorModule, PassportModule,
    TypeOrmModule.forFeature([LoginStamp])
  ],
  controllers: [AuthController, LoginController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
