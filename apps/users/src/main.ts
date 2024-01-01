import { NestFactory } from '@nestjs/core';
import config from './configuration/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const { brokerSettings } = config();
  console.log(brokerSettings);

  const app = await NestFactory.createMicroservice(AppModule, brokerSettings);
  const logger = new Logger();

  await app.listen();
  logger.log('Users microservice has been started!');
}
bootstrap();
