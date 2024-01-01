import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGroupDTO } from 'shared/dtos/groups/create-group.dto';
import { AddMoneyToGroupDTO, UpdateGroupDTO } from 'shared/dtos/groups/update-group.dto';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Get()
  getAll() {
    return this.groupService.getAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.groupService.get(id);
  }

  @Post()
  create(@Body() dto: CreateGroupDTO) {
    return this.groupService.create(dto);
  }

  @Post('/add-user')
  addUser(@Body() dto: UpdateGroupDTO) {
    return this.groupService.addUserToGroup(dto);
  }

  @Post('/add-money')
  addMoney(@Body() dto: AddMoneyToGroupDTO) {
    return this.groupService.addMoneyToGroup(dto);
  }
}
