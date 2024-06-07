import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from '@app/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port);
}
bootstrap();
