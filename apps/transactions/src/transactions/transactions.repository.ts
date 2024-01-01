import { Inject, Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { Transaction } from './transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTransactionDTO } from 'shared/dtos/transactions/create-transaction.dto';
import { ProceedTransactionDTO } from 'shared/dtos/transactions/proceed-transaction.dto';
import { TransactionStatus } from 'shared/enums/transaction-status.enum';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { MicroserviceClients } from 'apps/api_digital_wallet/src/constants';
import { MicroserviceUtil } from 'shared/microservice-helper.util';
import { MicroservicePatterns } from 'shared/microservices-patterns';

@Injectable()
export class TransactionRepository {
  private microserviceUtil: MicroserviceUtil;

  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @Inject(MicroserviceClients.USERS) private readonly usersClientProxy: ClientProxy,
  ) {
    this.microserviceUtil = new MicroserviceUtil(usersClientProxy);
  }

  /**
   *
   * @param ProceedTransactionDTO - { id, requestedStatus }
   * @returns boolean - If the transaction succeeded
   * @description This functions purpose simulates user clicks on "accept" on any of his transactions
   */
  async proceedTransaction({ id, requestedStatus }: ProceedTransactionDTO) {
    if (!this.transacationExists(id)) throw new RpcException('Transaction does not exists!');

    const session = await this.transactionModel.startSession();
    let didTransactionComplated = false;

    try {
      session.startTransaction();
      const transactionDoc = await this.transactionModel.findById(id).session(session);

      if (transactionDoc.status !== TransactionStatus.PENDING) {
        throw new RpcException(`Transaction is already finished! (${transactionDoc.status})`);
      }

      if (
        requestedStatus !== TransactionStatus.ACCEPTED &&
        requestedStatus !== TransactionStatus.REJECTED
      ) {
        throw new RpcException(`Transaction can be only accepted or rejected!`);
      }

      const dto = {
        from: transactionDoc.from,
        to: transactionDoc.to,
        amount: transactionDoc.amount,
      };

      if (requestedStatus === TransactionStatus.ACCEPTED) {
        // If will fail, it will throw an exception ( Atomic Operation )
        const result = await this.microserviceUtil.send(MicroservicePatterns.USERS.SEND_MONEY, dto);

        if (!result) {
          // If not enough money for example we would like to cancel the transaction
          transactionDoc.status = TransactionStatus.CANCELED;
        } else {
          transactionDoc.status = TransactionStatus.ACCEPTED;
        }
      } else {
        // Rejecting the transaction
        transactionDoc.status = TransactionStatus.REJECTED;
      }

      await transactionDoc.save({ session });

      await session.commitTransaction();

      didTransactionComplated = true;
      // send notification to transaction sender and receiver about the new status
      // sendNotification()
    } catch (error) {
      console.log(error);

      await session.abortTransaction();
    } finally {
      await session.endSession();
    }

    return didTransactionComplated;
  }

  async get(id: string) {
    return this.transactionModel.findById(id).lean().exec();
  }

  async create(createTransactionDTO: CreateTransactionDTO): Promise<Transaction> {
    const createdTransactionDoc = new this.transactionModel(createTransactionDTO);
    const transaction = await createdTransactionDoc.save();

    // Maybe more actions...

    return transaction;
  }

  async delete(transactionId: string) {
    const deletionQuery = this.transactionModel.deleteOne({ id: transactionId });

    return await deletionQuery.exec();
  }

  async getUserHistory(userId: string) {
    if (!isValidObjectId(userId)) throw new RpcException('Invalid User ID!');

    const getToUserQuery = this.transactionModel.find({ $or: [{ from: userId }, { to: userId }] });

    return await getToUserQuery.exec();
  }

  async getAll(): Promise<Transaction[]> {
    return this.transactionModel.find().lean().exec();
  }

  private async transacationExists(id: string) {
    const result = await this.transactionModel.findById(id).select('id').lean().exec();

    return !!result;
  }
}
