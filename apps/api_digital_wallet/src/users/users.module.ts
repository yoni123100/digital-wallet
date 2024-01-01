import { Module } from '@nestjs/common';
import { MicroserviceClients } from '../constants';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../configuration/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GroupsService } from './groups/groups.service';
import { GroupsController } from './groups/groups.controller';

@Module({
  controllers: [UsersController, GroupsController],
  providers: [
    UsersService,
    GroupsService,
    {
      provide: MicroserviceClients.USERS,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfiguration>) =>
        ClientProxyFactory.create(configService.get('usersRabbitOptions')),
    },
  ],
})
export class UsersModule {}
