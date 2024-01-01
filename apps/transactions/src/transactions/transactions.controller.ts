import { Controller } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroservicePatterns } from 'shared/microservices-patterns';
import { Transaction } from './transaction.schema';
import { CreateTransactionDTO } from 'shared/dtos/transactions/create-transaction.dto';
import { ProceedTransactionDTO } from 'shared/dtos/transactions/proceed-transaction.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(MicroservicePatterns.TRANSACTIONS.GET_ALL)
  getAll(): Promise<Transaction[]> {
    return this.transactionsService.getAll();
  }

  @MessagePattern(MicroservicePatterns.TRANSACTIONS.GET_ONE)
  getOne(@Payload() id: string): Promise<Transaction> {
    return this.transactionsService.get(id);
  }

  @MessagePattern(MicroservicePatterns.TRANSACTIONS.GET_HISTORY)
  getHistory(@Payload() userId: string) {
    return this.transactionsService.getHistory(userId);
  }

  @MessagePattern(MicroservicePatterns.TRANSACTIONS.CREATE)
  create(@Payload() createTransactionDto: CreateTransactionDTO) {
    return this.transactionsService.create(createTransactionDto);
  }

  @MessagePattern(MicroservicePatterns.TRANSACTIONS.PROCEED)
  proceed(@Payload() proceedTransactionDto: ProceedTransactionDTO) {
    console.log(proceedTransactionDto);

    return this.transactionsService.proceed(proceedTransactionDto);
  }
}
