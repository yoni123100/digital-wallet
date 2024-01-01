import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './group.schema';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { UserModule } from '../users/users.module';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
})
export class GroupModule {}
