import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceClients } from '../constants';
import { MicroservicePatterns } from 'shared/microservices-patterns';
import { CreateTransactionDTO } from 'shared/dtos/transactions/create-transaction.dto';
import { MicroserviceUtil } from 'shared/microservice-helper.util';
import { ProceedTransactionDTO } from 'shared/dtos/transactions/proceed-transaction.dto';

@Injectable()
export class TransactionsService {
  private microserviceUtil: MicroserviceUtil;

  constructor(
    @Inject(MicroserviceClients.TRANSACTIONS) private readonly transactionsClientProxy: ClientProxy,
  ) {
    this.microserviceUtil = new MicroserviceUtil(transactionsClientProxy);
  }

  getAll() {
    return this.microserviceUtil.send(MicroservicePatterns.TRANSACTIONS.GET_ALL, {});
  }

  get(id: string) {
    return this.microserviceUtil.send(MicroservicePatterns.TRANSACTIONS.GET_ONE, id);
  }

  getHistoryOfUser(userId: string) {
    return this.microserviceUtil.send(MicroservicePatterns.TRANSACTIONS.GET_HISTORY, userId);
  }

  createTransaction(createTransactionDto: CreateTransactionDTO) {
    return this.microserviceUtil.send(
      MicroservicePatterns.TRANSACTIONS.CREATE,
      createTransactionDto,
    );
  }

  proceedTransaction(proceedTransactionDto: ProceedTransactionDTO) {
    return this.microserviceUtil.send(
      MicroservicePatterns.TRANSACTIONS.PROCEED,
      proceedTransactionDto,
    );
  }
}
