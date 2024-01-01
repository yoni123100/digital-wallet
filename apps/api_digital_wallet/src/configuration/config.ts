import { RmqOptions, Transport } from '@nestjs/microservices';

export interface AppConfiguration {
  transactionRabbitOptions: RmqOptions;
  usersRabbitOptions: RmqOptions;
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
  transactionRabbitOptions: createRabbitContext(
    process.env.RABBIT_TRANSACTIONS_QUEUE || 'transactions_queue',
  ),
  usersRabbitOptions: createRabbitContext(process.env.RABBIT_USERS_QUEUE || 'users_queue'),
});
