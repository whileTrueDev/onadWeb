import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfreecaApiModule } from './api/afreeca-api/afreeca-api.module';
import { TwitchApiModule } from './api/twitch-api/twitch-api.module';
import { AppController } from './app.controller';
import { AuthModule } from './resources/auth/auth.module';
import { CertModule } from './resources/certification/cert.module';
import { CreatorModule } from './resources/creator/creator.module';
import { CreatorsModule } from './resources/creators/creators.module';
import { GamesModule } from './resources/games/games.module';
import { MarketerModule } from './resources/marketer/marketer.module';
import { TypeOrmConfigService } from './setting/config/database.config';
import { InquiryModule } from './resources/inquiry/inquiry.module';
import { SlackService } from './resources/slack/slack.service';
import { SlackModule } from './resources/slack/slack.module';
import { MailModule } from './resources/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    CreatorModule,
    TwitchApiModule,
    AfreecaApiModule,
    MarketerModule,
    CreatorsModule,
    CertModule,
    GamesModule,
    InquiryModule,
    SlackModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [SlackService],
})
export class AppModule {}
