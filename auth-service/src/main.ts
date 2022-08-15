import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestMicroservice, Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { protobufPackage } from './auth/auth.pb';
import { join } from 'path';
import { HttpExceptionFilter } from './auth/filter/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/config';

async function bootstrap() {
  const configApp = await NestFactory.create(AppModule);
  const configService = configApp.get(ConfigService);
  const appConfig: AppConfig = configService.get<AppConfig>('app');

  const logger = new Logger('Main');

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: appConfig.url,
      package: protobufPackage,
      protoPath: join('node_modules/proto/proto-files/auth.proto')
    }
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
  logger.log(`Microservice listening on ${appConfig.url}`);
}

bootstrap();
