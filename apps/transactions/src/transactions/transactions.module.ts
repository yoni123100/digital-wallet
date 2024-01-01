import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from './transactions.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transaction.schema';
import { MicroserviceClients } from 'apps/api_digital_wallet/src/constants';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../configuration/config';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionRepository,
    {
      provide: MicroserviceClients.USERS,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfiguration>) =>
        ClientProxyFactory.create(configService.get('userBrokerSettings')),
    },
  ],
})
export class TransactionsModule {}
