import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { CreateGroupDTO } from 'shared/dtos/groups/create-group.dto';
import { AddMoneyToGroupDTO, UpdateGroupDTO } from 'shared/dtos/groups/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  create(createGroupDto: CreateGroupDTO) {
    return this.groupRepository.create(createGroupDto);
  }

  getAll() {
    return this.groupRepository.getAll();
  }

  getOne(id: string) {
    return this.groupRepository.get(id);
  }

  addUser(updateGroupDto: UpdateGroupDTO) {
    return this.groupRepository.joinUser(updateGroupDto);
  }

  sendMoney(dto: AddMoneyToGroupDTO) {
    return this.groupRepository.addMoney(dto);
  }
}
