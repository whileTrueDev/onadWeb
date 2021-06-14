import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlimtalkService } from './alimtalk.service';
import { AlimtalkController } from './alimtalk.controller';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { KakaoAlimtalk } from '../../entities/KakaoAlimtalk';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerInfo, KakaoAlimtalk])],
  controllers: [AlimtalkController],
  providers: [AlimtalkService],
})
export class AlimtalkModule {}
