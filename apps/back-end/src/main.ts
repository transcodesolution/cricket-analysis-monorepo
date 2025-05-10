import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseTransformInterceptor } from './interceptors/response.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function startNestServer() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  const configService = new ConfigService();
  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets(join(__dirname, 'uploads'), { prefix: '/uploads' });
  app.enableCors({ origin: configService.get("CORS") });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseTransformInterceptor())
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

startNestServer();
