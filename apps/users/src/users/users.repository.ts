import { Injectable, Logger } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDTO } from 'shared/dtos/users/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import { CreateTransactionDTO } from 'shared/dtos/transactions/create-transaction.dto';

@Injectable()
export class UserRepository {
  private logger: Logger;

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async checkExists(id: string): Promise<boolean> {
    const userHasId = await this.userModel.findById(id).select('_id').lean().exec();

    return !!userHasId;
  }

  async get(id: string) {
    if (!isValidObjectId(id)) {
      throw new RpcException('Received not a valid user id!');
    }

    return this.userModel.findById(id).lean().exec();
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const createdUserDoc = new this.userModel(createUserDTO);

    return await createdUserDoc.save();
  }

  async delete(id: string) {
    const deletionQuery = this.userModel.deleteOne({ id });
    const result = await deletionQuery.exec();

    return result;
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }

  /**
   * @returns true if success, otherwise false
   */
  async sendMoney({ from, to, amount }: CreateTransactionDTO): Promise<boolean> {
    const session = await this.userModel.startSession();
    let status = false;
    try {
      session.startTransaction();

      // From User
      const currentUser = await this.userModel.findById(from).session(session);

      if (currentUser.amount - amount < 0)
        throw new RpcException(`There is not enough balance in ${currentUser.username}'s account!`);

      currentUser.amount -= amount;

      await currentUser.save();

      // To User
      const toUser = await this.userModel.findById(to).session(session);
      toUser.amount += amount;

      await toUser.save();

      this.logger.log(
        `Successfully sent ${amount}$ from ${currentUser.username} to ${toUser.username} account!`,
      );

      await session.commitTransaction();

      status = true;
    } catch (error) {
      this.logger.error(`Failed to perform transaction ${from} - ${to}`);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }

    return status;
  }

  async deposite(id: string, amount: number) {
    const session = await this.userModel.startSession();
    let status = false;
    try {
      session.startTransaction();

      // From User
      const currentUser = await this.userModel.findById(id).session(session);

      if (!currentUser) throw new RpcException('User does not exists!');

      currentUser.amount += amount;

      await currentUser.save({ session });

      this.logger.log(`Successfully deposited ${amount}$ from ${currentUser.username} account!`);

      await session.commitTransaction();

      status = true;
    } catch (error) {
      this.logger.error(`Failed to deposite to ${id}`);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }

    return status;
  }

  async withdraw(id: string, amount: number) {
    const session = await this.userModel.startSession();
    let status = false;
    try {
      session.startTransaction();

      // From User
      const currentUser = await this.userModel.findById(id).session(session);

      if (!currentUser) throw new RpcException('User does not exists!');

      if (currentUser.amount - amount < 0)
        throw new RpcException(`There is not enough balance in ${currentUser.username}'s account!`);

      currentUser.amount -= amount;

      await currentUser.save({ session });

      this.logger.log(`Successfully withdrawed ${amount}$ from ${currentUser.username} account!`);

      await session.commitTransaction();

      status = true;
    } catch (error) {
      this.logger.error(`Failed to withdraw from ${id}`);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }

    return status;
  }
}
