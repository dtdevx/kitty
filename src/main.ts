import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from '@app/config/swagger.config';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/cert/key.pem'),
    cert: fs.readFileSync('./src/cert/cert.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions } );
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  app.enableCors({
    origin: [
    'https://localhost:3000',
    'https://localhost:4200',
    ],
    credentials: true,
  });

  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port);
}
bootstrap();
