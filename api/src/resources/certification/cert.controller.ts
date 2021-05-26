import { Body, Controller, Post } from '@nestjs/common';
import { CertService } from './cert.service';
import { CertificationRes } from './interfaces/certificationRes.interface';

@Controller('certification')
export class CertController {
  constructor(private readonly certService: CertService) {}

  @Post()
  certification(@Body('imp_uid') impUid: string): Promise<CertificationRes> {
    console.log('[본인인증요청] imp_uid: ', impUid);
    return this.certService.certificate(impUid);
  }
}
