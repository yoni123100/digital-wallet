import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  RequestedTransactionStatus,
  TransactionStatus,
} from 'shared/enums/transaction-status.enum';

export class ProceedTransactionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    enum: TransactionStatus,
    examples: [TransactionStatus.ACCEPTED, TransactionStatus.REJECTED],
  })
  @IsString()
  @IsNotEmpty()
  requestedStatus: RequestedTransactionStatus;
}
