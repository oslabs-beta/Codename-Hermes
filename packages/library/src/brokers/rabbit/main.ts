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
 * Purpose: to produce new Rabbit MQ objects
 * @param connection 
 * @param topics 
 * @returns Rabbit instantiation 
 */
export async function createRabbitClass (connection: RabbitClientOptions, topics: RabbitTopic){
  const rabbit = new Rabbit(connection, topics);
  await rabbit.init();
  return rabbit;
}

// TODO: Add error handling
export default class Rabbit extends MessageBroker {
  private connection: Connection | null;
  private channel: amqp.Channel | null;
  private topics: RabbitTopic;
  private defaultConfig: RabbitClientOptions;
  private consumerTags: { [topicName: string]: RabbitListenerOptions };
  constructor(connection: RabbitClientOptions, topics: RabbitTopic) {
    super(connection, topics);

    // Let's create a default config, we are also relying on default options for the connect method.

    // const defaultConfig: RabbitClientOptions = {
    //   ...connection,
    //   port: connection.port ?? 5672,
    //   // protocol: connection.protocol ?? 'amqp',
    //   // TODO: remove this when we add secure connection support. This overwrites what the user wants.
    //   protocol: 'amqp',
    // };

    this.defaultConfig = {

      ...connection,
      port: connection.port ?? 5672,
      // protocol: connection.protocol ?? 'amqp',
      // TODO: remove this when we add secure connection support. This overwrites what the user wants.
      protocol: 'amqp',
    }

    this.topics = topics;
    this.consumerTags = {};

    // This is jank... I'm sorry
    // REFACTOR: all this 👇
    this.connection = null;
    this.channel = null;
    const that = this;

    // (async () => {
    //   that.connection = await amqp.connect(defaultConfig);
    //   if (that.connection === null)
    //     throw new Error('No connection for Rabbit.');

    //   that.channel = await that.connection!.createChannel();
    //   if (that.channel === null) throw new Error('No channel for Rabbit.');

    //   // console.log('this is the channel', that.channel);
    //   // const that = that;

    //   console.log('lets look at the new topics', that.topics);
    //   Object.keys(topics).forEach(async (topic) => {
    //     // POSSIBLE REFACTOR: Don't know if we need await
    //     await that.channel?.assertExchange(
    //       that.topics[topic].exchange.name,
    //       that.topics[topic].exchange.type ?? 'topic',
    //       that.topics[topic].exchange ?? {}
    //     );

    //    const q = await that.channel?.assertQueue(topic, that.topics[topic] ?? {});

    //    console.log('this is the created q', q);

    //     // TODO: research and implement "args"
    //     await that.channel?.bindQueue(
    //       topic,
    //       that.topics[topic].exchange.name,
    //       that.topics[topic].key ?? topic
    //     );
    //   });


    console.log('in constructor - channel', that.channel);

    console.log('in constructor - connection', that.connection);

    console.log('this is that in the constructor', that);

  }

  
  //initialize method on Rabbit Class constructor to be used in the asynchronous factory function
  //The method is used to setup the following
  /**
   * connection
   * create exchange
   * create queue
   * bind exchange to queue via key (NOTE: key is determined when creating topics to pass into new Rabbit instatiation. The key here is the "binding key".
   * in order for the queue to receive messages, the "routingKey" in the send function with publish MUST MATCH
   * reference: https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html )
   */
  async init() {


    this.connection = await amqp.connect(this.defaultConfig);
    if (this.connection === null)
      throw new Error('No connection for Rabbit. in init function');

    this.channel = await this.connection!.createChannel();
    if (this.channel === null) throw new Error('No channel for Rabbit. in init function');

    // console.log('this is the channel', that.channel);
    // const that = that;

  
    Object.keys(this.topics).forEach(async (topic) => {
      // POSSIBLE REFACTOR: Don't know if we need await
      await this.channel?.assertExchange(
        this.topics[topic].exchange.name,
        this.topics[topic].exchange.type ?? 'topic',
        this.topics[topic].exchange ?? {}
      );

    await this.channel?.assertQueue(topic, this.topics[topic] ?? {});

      // TODO: research and implement "args"
      await this.channel?.bindQueue(
        topic,
        this.topics[topic].exchange.name,
        this.topics[topic].key ?? topic
      );
    });


  }


  // TODO: Add support for multi messages
  //! the second argument in the PUBLISH method NEEDS to be the "key". Before refactor it was the topic. The reason is because this is the routingkey that MUST MATCH the bindingKey
  //! that is found within the init function
  async send(topic: string, message: string, options?: amqp.Options.Publish) {
    console.log('hello from within send!');
    console.log('this is "this" in the send method', this);
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

    // this.channel?.consume(topic, (message) => {
    //   callback(null, )
    // });
  }
}


