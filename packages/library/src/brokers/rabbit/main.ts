import { Connection } from 'amqplib';
import MessageBroker, {
  GenericClientOptions,
  GenericListenerOptions,
  GenericMessage,
  GenericTopic,
  MessageCallback,
} from '../MessageBroker';

import * as amqp from 'amqplib';

export type RabbitClientOptions = GenericClientOptions & {
  username?: string;
  password?: string;
  // TODO: add support for secure connections
  // TODO: REFACTOR: Maybe we can make this a secure boolean to unify between Kafka and this
  protocol?: 'amqp' | 'amqps';
  vhost?: string;
  locale?: string;
  frameMax?: number;
  heartbeat?: number;
};

// TODO: add the rest of the options
export type RabbitTopic = GenericTopic<{
  exclusive?: boolean;
  durable?: boolean;
  autoDelete?: boolean;
  arguments?: any;
  messageTtl?: number;
  expires?: number;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
  maxLength?: number;
  maxPriority?: number;
}>;

export type RabbitListenerOptions = GenericListenerOptions & {};

export type RabbitMessage = GenericMessage & {};

// TODO: Add error handling

export default class Rabbit extends MessageBroker {
  private connection: Connection | null;
  private channel: amqp.Channel | null;
  constructor(connection: RabbitClientOptions, topics: RabbitTopic) {
    super(connection, topics);

    // Let's create a default config, we are also relying on default options for the connect method.
    const defaultConfig: RabbitClientOptions = {
      ...connection,
      port: connection.port ?? 5672,
      protocol: connection.protocol ?? 'amqp',
    };

    // This is jank... I'm sorry
    this.connection = null;
    this.channel = null;
    (async () => {
      this.connection = await amqp.connect(defaultConfig);
      if (this.connection === null)
        throw new Error('No connection for Rabbit.');

      this.channel = await this.connection!.createChannel();
      if (this.channel === null) throw new Error('No channel for Rabbit.');

      const that = this;
      Object.keys(topics).forEach((topic) =>
        that.channel?.assertQueue(topic, topics[topic] ?? {})
      );
    }).bind(this)();
  }

  // TODO: Add support for multi messages
  send(topic: string, message: string, options?: amqp.Options.Publish) {
    this.channel?.sendToQueue(topic, Buffer.from(message), options);
  }

  listener(topics: string[], options: RabbitListenerOptions) {}

  consume(topic: string, callback: MessageCallback<RabbitMessage>) {}
}