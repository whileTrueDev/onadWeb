import { Module } from '@nestjs/common';
import { IamportService } from './iamport.service';

@Module({
  providers: [IamportService],
  exports: [IamportService],
})
export class IamportModule {}
