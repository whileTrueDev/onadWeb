import { Test, TestingModule } from '@nestjs/testing';
import { CreatorsAnalysisService } from './creators-analysis.service';

describe('CreatorsAnalysisService', () => {
  let service: CreatorsAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorsAnalysisService],
    }).compile();

    service = module.get<CreatorsAnalysisService>(CreatorsAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
