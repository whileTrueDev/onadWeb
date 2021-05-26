import { Test, TestingModule } from '@nestjs/testing';
import { ManualService } from './manual.service';

describe('ManualService', () => {
  let service: ManualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManualService],
    }).compile();

    service = module.get<ManualService>(ManualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
