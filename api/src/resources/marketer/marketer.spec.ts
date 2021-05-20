import { Test, TestingModule } from '@nestjs/testing';
import { MarketerController } from './marketer.controller';
import { MarketerService } from './marketer.service';

describe('MarketerController', () => {
  let controller: MarketerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketerController],
      providers: [MarketerService],
    }).compile();

    controller = module.get<MarketerController>(MarketerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
