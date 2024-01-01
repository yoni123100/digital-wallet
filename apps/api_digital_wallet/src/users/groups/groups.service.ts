import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceClients } from '../../constants';
import { MicroservicePatterns } from 'shared/microservices-patterns';
import { MicroserviceUtil } from 'shared/microservice-helper.util';
import { CreateGroupDTO } from 'shared/dtos/groups/create-group.dto';
import { AddMoneyToGroupDTO, UpdateGroupDTO } from 'shared/dtos/groups/update-group.dto';

@Injectable()
export class GroupsService {
  private microserviceUtil: MicroserviceUtil;

  constructor(@Inject(MicroserviceClients.USERS) private readonly usersClientProxy: ClientProxy) {
    this.microserviceUtil = new MicroserviceUtil(usersClientProxy);
  }

  getAll() {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.GROUPS.GET_ALL, {});
  }

  get(id: string) {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.GROUPS.GET_ONE, id);
  }

  create(dto: CreateGroupDTO) {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.GROUPS.CREATE, dto);
  }

  addUserToGroup(dto: UpdateGroupDTO) {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.GROUPS.ADD_USER, dto);
  }

  addMoneyToGroup(dto: AddMoneyToGroupDTO) {
    return this.microserviceUtil.send(MicroservicePatterns.USERS.GROUPS.ADD_MONEY, dto);
  }
}
