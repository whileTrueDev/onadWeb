import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfreecaApiModule } from '../../api/afreeca-api/afreeca-api.module';
import { TwitchApiModule } from '../../api/twitch-api/twitch-api.module';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { CreatorController } from './creator.controller';
import { CreatorService } from './creator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorInfo,
    ]),
    TwitchApiModule,
    AfreecaApiModule,
  ],
  controllers: [CreatorController],
  providers: [CreatorService],
  exports: [CreatorService],
})
export class CreatorModule {}
