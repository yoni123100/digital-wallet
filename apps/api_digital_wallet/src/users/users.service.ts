import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceClients } from '../constants';
import { MicroservicePatterns } from 'shared/microservices-patterns';
import { MicroserviceUtil } from 'shared/microservice-helper.util';
import { CreateUserDTO } from 'shared/dtos/users/create-user.dto';

@Injectable()
export class UsersService {
  private microserviceUtil: MicroserviceUtil;

  constructor(@Inject(MicroserviceClients.USERS) private readonly usersClientProxy: ClientProxy) {
    this.microserviceUtil = new MicroserviceUtil(usersClientProxy);
  }

  getAll() {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.GET_ALL, {});
  }

  get(id: string) {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.GET_ONE, id);
  }

  create(createUserDto: CreateUserDTO) {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.CREATE, createUserDto);
  }
}
