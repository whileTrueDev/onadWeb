import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileImageService } from './profile-image.service';
import { ProfileImageController } from './profile-image.controller';
import { MarketerInfo } from '../../../entities/MarketerInfo';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerInfo])],
  controllers: [ProfileImageController],
  providers: [ProfileImageService],
})
export class ProfileImageModule {}
