import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import config, { AppConfiguration } from './configuration/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: [
        'enviornments/transactions.env',
        `enviornments/transactions.${process.env.NODE_ENV}.env`,
      ],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfiguration>) => {
        console.log(configService.get('mongoOptions'));

        return configService.get('mongoOptions');
      },
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
