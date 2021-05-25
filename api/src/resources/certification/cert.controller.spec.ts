import { Test, TestingModule } from '@nestjs/testing';
import { CertController } from './cert.controller';
import { CertService } from './cert.service';

describe('CertController', () => {
  let controller: CertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertController],
      providers: [CertService],
    }).compile();

    controller = module.get<CertController>(CertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
