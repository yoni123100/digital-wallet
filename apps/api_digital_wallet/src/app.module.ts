import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './configuration/config';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TransactionsModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['enviornments/api.env', `enviornments/api.${process.env.NODE_ENV}.env`],
    }),
  ],
})
export class AppModule {}
