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

export type RabbitExchange = {
  [exchangeName: string]: {
    config: amqp.Options.AssertExchange & {
      type?: 'direct' | 'topic' | 'headers' | 'fanout' | 'match';
    };
    topics: RabbitTopic;
  };
};
// What the RabbitExchange should look like
// {
//   exchange: {
//     topic: {
//       // topicstuff
//     }
//   },

//   exchange2: {
//     topic: {
//       //topic stuff
//     }
//   }
// }

// TODO: add the rest of the options
export type RabbitTopic = GenericTopic<amqp.Options.AssertQueue>;

export type RabbitListenerOptions = GenericListenerOptions & {};

export type RabbitMessage = GenericMessage & {};

// TODO: Add error handling

export default class Rabbit extends MessageBroker {
  private connection: Connection | null;
  private channel: amqp.Channel | null;
  private exchanges: RabbitExchange;
  constructor(connection: RabbitClientOptions, exchanges: RabbitExchange) {
    super(connection, exchanges);

    // Let's create a default config, we are also relying on default options for the connect method.
    const defaultConfig: RabbitClientOptions = {
      ...connection,
      port: connection.port ?? 5672,
      protocol: connection.protocol ?? 'amqp',
    };

    // This is jank... I'm sorry
    // REFACTOR: all this 👇
    this.connection = null;
    this.channel = null;
    (async () => {
      this.connection = await amqp.connect(defaultConfig);
      if (this.connection === null)
        throw new Error('No connection for Rabbit.');

      this.channel = await this.connection!.createChannel();
      if (this.channel === null) throw new Error('No channel for Rabbit.');

      const that = this;
      Object.keys(exchanges).forEach((exchange) =>
        Object.keys(exchanges[exchange].topics).forEach(async (topic) => {
          // POSSIBLE REFACTOR: Don't know if we need await
          await that.channel?.assertExchange(
            exchange,
            exchanges[exchange].config.type ?? 'topic',
            exchanges[exchange].config ?? {}
          );
          await that.channel?.assertQueue(
            topic,
            exchanges[exchange].topics[topic] ?? {}
          );
          // TODO: research and implement "args"
          await that.channel?.bindQueue(topic, exchange, topic);
        })
      );
    }).bind(this)();

    this.exchanges = exchanges;
  }

  // TODO: Add support for multi messages
  send(topic: string, message: string, options?: amqp.Options.Publish) {
    this.channel?.sendToQueue(topic, Buffer.from(message), options);
  }

  listener(topics: string[], options: RabbitListenerOptions) {}

  consume(topic: string, callback: MessageCallback<RabbitMessage>) {}
}
