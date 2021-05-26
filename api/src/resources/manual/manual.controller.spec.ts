import { Test, TestingModule } from '@nestjs/testing';
import { ManualController } from './manual.controller';
import { ManualService } from './manual.service';

describe('ManualController', () => {
  let controller: ManualController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManualController],
      providers: [ManualService],
    }).compile();

    controller = module.get<ManualController>(ManualController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
