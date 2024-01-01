import { RmqOptions, Transport } from '@nestjs/microservices';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import dbConfig from './db.config';

export interface AppConfiguration {
  mongoOptions: MongooseModuleOptions;
  brokerSettings: RmqOptions;
  transactionsBrokerSettings: RmqOptions;
}

const createRabbitContext = (queue: string): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [`amqp://${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`],
    queue,
    queueOptions: {
      durable: false,
    },
  },
});

export default (): AppConfiguration => ({
  mongoOptions: dbConfig(),
  brokerSettings: createRabbitContext(process.env.QUEUE_NAME || 'users_queue'),
  transactionsBrokerSettings: createRabbitContext(
    process.env.TRANSACTIONS_QUEUE || 'transactions_queue',
  ),
});
