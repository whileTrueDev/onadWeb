import { Module } from '@nestjs/common';
import { AfreecaApiService } from './afreeca-api.service';


@Module({
  providers: [AfreecaApiService],
  exports: [AfreecaApiService],
})
export class AfreecaApiModule {}
