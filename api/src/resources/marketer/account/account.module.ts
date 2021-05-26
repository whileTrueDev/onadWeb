import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MarketerInfo } from '../../../entities/MarketerInfo';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerInfo])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
