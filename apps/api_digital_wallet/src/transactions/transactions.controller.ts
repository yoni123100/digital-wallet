import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from 'shared/dtos/transactions/create-transaction.dto';
import { ProceedTransactionDTO } from 'shared/dtos/transactions/proceed-transaction.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transacationService: TransactionsService) {}

  @Get()
  getAll() {
    return this.transacationService.getAll();
  }

  @Get(':id')
  getTransaction(@Param('id') id: string) {
    return this.transacationService.get(id);
  }

  @Get('history/:userId')
  getHistory(@Param('userId') userId: string) {
    return this.transacationService.getHistoryOfUser(userId);
  }

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDTO) {
    return this.transacationService.createTransaction(createTransactionDto);
  }

  @ApiBody({
    type: ProceedTransactionDTO,
  })
  @Post('proceed')
  proceedTransaction(@Body() proceedTransactionDto: ProceedTransactionDTO) {
    return this.transacationService.proceedTransaction(proceedTransactionDto);
  }
}
