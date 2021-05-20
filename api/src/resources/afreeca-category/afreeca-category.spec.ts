import { Test, TestingModule } from '@nestjs/testing';
import { AfreecaCategory } from '../../entities/AfreecaCategory';
import { AfreecaCategoryController } from './afreeca-category.controller';
import { AfreecaCategoryService } from './afreeca-category.service';

describe('AfreecaCategoryController', () => {
  let controller: AfreecaCategoryController;
  let service : AfreecaCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfreecaCategoryController],
    }).compile();

    controller = module.get<AfreecaCategoryController>(AfreecaCategoryController);
    service = module.get<AfreecaCategoryService>(AfreecaCategoryService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return an array of AfreecaCategory', async () => {
      const result:AfreecaCategory[] = [
        {
          categoryId: '001234', categoryNameKr: 'cateogry1', isSub: 0, parentCategoryId: null
        },
        {
          categoryId: '000000', categoryNameKr: 'cateogry2', isSub: 1, parentCategoryId: '001234'
        },
      ];
      jest.spyOn(service, 'getCategories').mockImplementation(async () => result);

      expect(await controller.getCategories()).toBe(result);
    });
  });
});
