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

//function to act as asynchronous factory function
/**
 * Purpose: to produce new RabbitMQ message broker with async code.
 * @param connection
 * @param topics
 * @returns RabbitMQ object to be used as a message broker
 */
export async function createRabbitClass(
  connection: RabbitClientOptions,
  topics: RabbitTopic
) {
  return new Promise<Rabbit>(async (resolve, reject) => {
    try {
      const defaultConfig = {
        ...connection,
        // TODO: remove this when we add secure connection support. This overwrites what the user wants.
        protocol: 'amqp',
        host: connection.host || 'localhost',
        port: connection.port || 5672,
      };

      const rabbitClient = await amqp.connect(defaultConfig);
      const channel = await rabbitClient.createChannel();

      Object.keys(topics).forEach(async (topic) => {
        await channel.assertExchange(
          topics[topic].exchange.name,
          topics[topic].exchange.type ?? 'topic',
          topics[topic].exchange ?? {}
        );

        await channel.assertQueue(topic, topics[topic] ?? {});

        // TODO: research and implement "args"
        await channel.bindQueue(
          topic,
          topics[topic].exchange.name,
          topics[topic].key ?? topic
        );
      });

      resolve(new Rabbit(rabbitClient, channel, topics));
    } catch (error) {
      reject(error as any);
    }
  });
}

// TODO: Add error handling
export default class Rabbit /*extends MessageBroker*/ {
  private client: Connection;
  private channel: amqp.Channel;
  private topics: RabbitTopic;
  private consumerTags: { [topicName: string]: RabbitListenerOptions };
  constructor(client: Connection, channel: amqp.Channel, topics: RabbitTopic) {
    // super(connection, topics);

    this.client = client;
    this.channel = channel;

    this.topics = topics;
    this.consumerTags = {};
  }

  // TODO: Add support for multi messages
  //! the second argument in the PUBLISH method NEEDS to be the "key". Before refactor it was the topic. The reason is because this is the routingkey that MUST MATCH the bindingKey
  //! that is found within the init function
  async send(topic: string, message: string, options?: amqp.Options.Publish) {
    this.channel?.publish(
      this.topics[topic].exchange.name,
      this.topics[topic].key ?? topic,
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
  }
}
