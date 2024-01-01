import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TransactionStatus } from '../../../../shared/enums/transaction-status.enum';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String, required: true })
  from: string;

  @Prop({ type: Number, required: true })
  amount: string;

  @Prop({ type: String, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
