import { Controller } from '@nestjs/common';
import { UserService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroservicePatterns } from 'shared/microservices-patterns';
import { User } from './user.schema';
import { CreateUserDTO } from 'shared/dtos/users/create-user.dto';
import { CreateTransactionDTO } from 'shared/dtos/transactions/create-transaction.dto';

@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @MessagePattern(MicroservicePatterns.USERS.GET_ALL)
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @MessagePattern(MicroservicePatterns.USERS.GET_ONE)
  getOne(@Payload() id: string): Promise<User> {
    return this.usersService.getOne(id);
  }

  @MessagePattern(MicroservicePatterns.USERS.CREATE)
  create(@Payload() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern(MicroservicePatterns.USERS.SEND_MONEY)
  sendMoney(@Payload() requestedTransactionDto: CreateTransactionDTO) {
    return this.usersService.sendMoney(requestedTransactionDto);
  }
}
