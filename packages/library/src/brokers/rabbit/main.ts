import { Connection } from 'amqplib';
import MessageBroker, {
  GenericClientOptions,
  GenericListenerOptions,
  GenericMessage,
  GenericTopic,
  MessageCallback,
} from '../MessageBroker';

import * as amqp from 'amqplib';
import { convertGenericListenerConfigToRabbitAmqpConfig } from './utils/utilFunctions';

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
export type RabbitTopic = GenericTopic<
  {
    exchange: amqp.Options.AssertExchange & {
      name: string;
      type?: 'direct' | 'topic' | 'headers' | 'fanout' | 'match';
    };
  } & amqp.Options.AssertQueue & {
      key?: string;
    }
>;

export type RabbitListenerOptions = GenericListenerOptions & {
  consumerTag?: string;
  exclusive?: boolean;
  priority?: number;
  arguments?: any;
};

export type RabbitMessage = GenericMessage & {};

// TODO: Add error handling

export default class Rabbit extends MessageBroker {
  private connection: Connection | null;
  private channel: amqp.Channel | null;
  private topics: RabbitTopic;
  private consumerTags: { [topicName: string]: RabbitListenerOptions };
  constructor(connection: RabbitClientOptions, topics: RabbitTopic) {
    super(connection, topics);

    // Let's create a default config, we are also relying on default options for the connect method.
    const defaultConfig: RabbitClientOptions = {
      ...connection,
      port: connection.port ?? 5672,
      // protocol: connection.protocol ?? 'amqp',
      // TODO: remove this when we add secure connection support. This overwrites what the user wants.
      protocol: 'amqp',
    };

    this.topics = topics;
    this.consumerTags = {};

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
      Object.keys(topics).forEach(async (topic) => {
        // POSSIBLE REFACTOR: Don't know if we need await
        await that.channel?.assertExchange(
          that.topics[topic].exchange.name,
          that.topics[topic].exchange.type ?? 'topic',
          that.topics[topic].exchange ?? {}
        );

        await that.channel?.assertQueue(topic, that.topics[topic] ?? {});

        // TODO: research and implement "args"
        await that.channel?.bindQueue(
          topic,
          that.topics[topic].exchange.name,
          that.topics[topic].key ?? topic
        );
      });
    }).bind(this)();
  }

  // TODO: Add support for multi messages
  send(topic: string, message: string, options?: amqp.Options.Publish) {
    this.channel?.publish(
      this.topics[topic].exchange.name,
      topic,
      Buffer.from(message),
      options
    );
  }

  listener(topics: string, options?: RabbitListenerOptions) {
    const convertedOptions = convertGenericListenerConfigToRabbitAmqpConfig(
      options ?? {}
    );

    // "listener" doesn't do anything except store options right now
  }

  consume(topic: string, callback: MessageCallback<RabbitMessage | null>): void;
  consume(
    topic: string,
    listenerOptions: RabbitListenerOptions,
    callback: MessageCallback<RabbitMessage | null>
  ): void;
  consume(
    topic: string,
    optionsOrCallback?:
      | RabbitListenerOptions
      | MessageCallback<RabbitMessage | null>,
    callback?: MessageCallback<RabbitMessage | null>
  ): void {
    const that = this;

    // this.channel?.consume(topic, (message) => {
    //   callback(null, )
    // });
  }
}
