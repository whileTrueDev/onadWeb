import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmConfigService } from './setting/config/database.config';
import { AfreecaCategoryModule } from './resources/afreeca-category/afreeca-category.module';
import { AuthModule } from './resources/auth/auth.module';
import { CreatorModule } from './resources/creator/creator.module';
import { TwitchApiModule } from './api/twitch-api/twitch-api.module';
import { AfreecaApiModule } from './api/afreeca-api/afreeca-api.module';
import { MarketerModule } from './resources/marketer/marketer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AfreecaCategoryModule,
    AuthModule,
    CreatorModule,
    TwitchApiModule,
    AfreecaApiModule,
    MarketerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
