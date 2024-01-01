import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config, { AppConfiguration } from './configuration/config';
import { UserModule } from './users/users.module';
import { GroupModule } from './groups/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['enviornments/users.env', `enviornments/users.${process.env.NODE_ENV}.env`],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfiguration>) => {
        return configService.get('mongoOptions');
      },
    }),
    UserModule,
    GroupModule,
  ],
})
export class AppModule {}
