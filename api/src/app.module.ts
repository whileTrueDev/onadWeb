import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AfreecaApiModule } from './api/afreeca-api/afreeca-api.module';
import { TwitchApiModule } from './api/twitch-api/twitch-api.module';
import { AppController } from './app.controller';
import { AuthModule } from './resources/auth/auth.module';
import { CertModule } from './resources/certification/cert.module';
import { CreatorModule } from './resources/creator/creator.module';
import { CreatorsModule } from './resources/creators/creators.module';
import { GamesModule } from './resources/games/games.module';
import { MarketerModule } from './resources/marketer/marketer.module';
import { InquiryModule } from './resources/inquiry/inquiry.module';
import { SlackService } from './resources/slack/slack.service';
import { SlackModule } from './resources/slack/slack.module';
import { MailModule } from './resources/mail/mail.module';
import { ManualModule } from './resources/manual/manual.module';
import { NoticeModule } from './resources/notice/notice.module';
import { AlimtalkModule } from './resources/alimtalk/alimtalk.module';
import ormconfig from './setting/ormconfig';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormconfig),
    ScheduleModule.forRoot(),
    TasksModule,
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
    ManualModule,
    NoticeModule,
    AlimtalkModule,
  ],
  controllers: [AppController],
  providers: [SlackService],
})
export class AppModule {}
