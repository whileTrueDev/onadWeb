import { Test, TestingModule } from '@nestjs/testing';
import { CertService } from './cert.service';

describe('CertService', () => {
  let service: CertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertService],
    }).compile();

    service = module.get<CertService>(CertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
