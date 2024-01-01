import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './user.schema';
import { CreateUserDTO } from 'shared/dtos/users/create-user.dto';
import { CreateTransactionDTO } from 'shared/dtos/transactions/create-transaction.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private logger: Logger;

  constructor(private readonly userRepostiory: UserRepository) {}

  getAll(): Promise<User[]> {
    return this.userRepostiory.getAll();
  }

  getOne(id: string): Promise<User> {
    return this.userRepostiory.get(id);
  }

  create(createUserDto: CreateUserDTO): Promise<User> {
    return this.userRepostiory.create(createUserDto);
  }

  withdraw(id: string, amount: number) {
    return this.userRepostiory.withdraw(id, amount);
  }

  async sendMoney({ from, to, amount }: CreateTransactionDTO): Promise<void> {
    const fromUserExists = await this.userRepostiory.checkExists(from);
    const toUserExists = await this.userRepostiory.checkExists(to);

    if (!fromUserExists || !toUserExists)
      throw new RpcException('Both users must exist to continue this operation!');

    await this.userRepostiory.sendMoney({ from, to, amount });
  }
}
