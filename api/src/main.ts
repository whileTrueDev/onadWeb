import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AppSetting } from './setting/appSetting';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appSetting = new AppSetting(app);
  appSetting.initialize();

  await app.listen(3000);
}

bootstrap();
