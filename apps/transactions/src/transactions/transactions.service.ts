import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transactions.repository';
import { Transaction } from './transaction.schema';
import { CreateTransactionDTO } from '../../../../shared/dtos/transactions/create-transaction.dto';
import { ProceedTransactionDTO } from 'shared/dtos/transactions/proceed-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepostiory: TransactionRepository) {}

  getAll(): Promise<Transaction[]> {
    return this.transactionRepostiory.getAll();
  }

  get(id: string): Promise<Transaction> {
    return this.transactionRepostiory.get(id);
  }

  create(createTransactionDto: CreateTransactionDTO) {
    return this.transactionRepostiory.create(createTransactionDto);
  }

  proceed(proceedTransactionDto: ProceedTransactionDTO) {
    return this.transactionRepostiory.proceedTransaction(proceedTransactionDto);
  }

  getHistory(userId: string) {
    return this.transactionRepostiory.getUserHistory(userId);
  }
}
