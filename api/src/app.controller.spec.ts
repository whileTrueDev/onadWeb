import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController();
  });

  describe('healthCheck', () => {
    it('should return "alive"', async () => {
      const result = 'alive';
      expect(appController.healthCheck()).toBe(result);
    });
  });
});
