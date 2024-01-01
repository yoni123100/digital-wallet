import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroservicePatterns } from 'shared/microservices-patterns';
import { AddMoneyToGroupDTO, UpdateGroupDTO } from 'shared/dtos/groups/update-group.dto';
import { CreateGroupDTO } from 'shared/dtos/groups/create-group.dto';

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @MessagePattern(MicroservicePatterns.USERS.GROUPS.GET_ALL)
  getAll() {
    return this.groupService.getAll();
  }

  @MessagePattern(MicroservicePatterns.USERS.GROUPS.GET_ONE)
  getOne(@Payload() id: string) {
    return this.groupService.getOne(id);
  }

  @MessagePattern(MicroservicePatterns.USERS.GROUPS.ADD_MONEY)
  addMoneyToGroup(@Payload() dto: AddMoneyToGroupDTO) {
    return this.groupService.sendMoney(dto);
  }

  @MessagePattern(MicroservicePatterns.USERS.GROUPS.ADD_USER)
  addUserToGroup(@Payload() dto: UpdateGroupDTO) {
    return this.groupService.addUser(dto);
  }

  @MessagePattern(MicroservicePatterns.USERS.GROUPS.CREATE)
  createGroup(@Payload() dto: CreateGroupDTO) {
    return this.groupService.create(dto);
  }
}
