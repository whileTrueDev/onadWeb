import { Module } from '@nestjs/common';
import { CertService } from './cert.service';
import { CertController } from './cert.controller';

@Module({
  controllers: [CertController],
  providers: [CertService]
})
export class CertModule {}
