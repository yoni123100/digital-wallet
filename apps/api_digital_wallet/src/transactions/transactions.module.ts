import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MicroserviceClients } from '../constants';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../configuration/config';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: MicroserviceClients.TRANSACTIONS,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfiguration>) =>
        ClientProxyFactory.create(configService.get('transactionRabbitOptions')),
    },
  ],
})
export class TransactionsModule {}
