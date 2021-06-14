import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { AfreecaCategory } from '../../entities/AfreecaCategory';

@Module({
  imports: [TypeOrmModule.forFeature([AfreecaCategory])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
