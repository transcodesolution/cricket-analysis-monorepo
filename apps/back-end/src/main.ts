import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseTransformInterceptor } from './interceptors/response.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { WsCustomExceptionFilter } from './helper/ws-exception.filter';

async function startNestServer() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  const configService = new ConfigService();
  app.setGlobalPrefix(globalPrefix);
  const uploadsPath = configService.get("NODE_ENV") === "production"
    ? join(__dirname, 'uploads')
    : join(__dirname, '..', '..', '..', 'uploads');
  app.useStaticAssets(uploadsPath, { prefix: "/uploads" });
  app.enableCors({ origin: configService.get("CORS") });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new WsCustomExceptionFilter());
  app.use(bodyParser.json({ limit: '500mb' }));
  app.useGlobalInterceptors(new ResponseTransformInterceptor())
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

startNestServer();