import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export type DatabaseConfiguration = MongooseModuleOptions;

export default registerAs(
  'database',
  (): MongooseModuleOptions => ({
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
    uri: `mongodb://${process.env.DATABASE_URL}:${process.env.DATABASE_PORT}`,
    dbName: process.env.DATABASE_NAME,
  }),
);
