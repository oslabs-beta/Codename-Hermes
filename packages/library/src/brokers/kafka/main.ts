import MessageBroker, {
  GenericClientOptions,
  GenericListenerOptions,
  GenericMessage,
  GenericTopic,
  MessageCallback,
  ErrorCallback,
} from '../MessageBroker';
import {
  Consumer,
  KafkaClient,
  Message,
  Producer,
  ProducerOptions,
  RetryOptions,
} from 'kafka-node';
import {
  formatMessageToKafkaMessage,
  formatTopics,
} from './utils/utilFunctions';

export type KafkaClientOptions = GenericClientOptions & {
  connectTimeout?: number;
  requestTimeout?: number;
  autoConnect?: boolean;
  connectRetryOptions?: RetryOptions;
  idleConnection?: number;
  reconnectOnIdle?: boolean;
  maxAsyncRequests?: number;
  // Figure out kafka-node ssl options
  // sslOptions?: null;
  // Figure out kafka-node sasl options
  // sasl?: null;
};

export type KafkaTopic = GenericTopic<null | {
  partition?: number;
  offset?: number;
}>;

export type KafkaSendOptions = {
  key?: string;
  partition?: number;
  attributes?: number;
};

// Based off the ConsumerOptions from kafka-node
export type KafkaListenerOptions = GenericListenerOptions & {
  groupId?: string;
  autoCommitIntervalMs?: number;
  fetchMaxWaitMs?: number;
  fetchMinBytes?: number;
  fetchMaxBytes?: number;
  fromOffset?: boolean;
  // encoding?: 'buffer' | 'utf8';
  // keyEncoding?: 'buffer' | 'utf8';
};

export type KafkaMessage = GenericMessage & {
  offset?: number;
  partition?: number;
  highWaterOffset?: number;
  key?: string;
};

//TODO: error handling lol
//TODO: comments lol
//TODO: unified class interface for kafka, rabbitmq, and redis (config options, broker host, etc)
//TODO: kafka cluster host support
//TODO: convert to promise based
//TODO: clarify error messages.
//TODO: REFACTOR: use types in seperate file

/**
 * TODO:
 * - ConsumerStream
 * - ProducerStream
 * - Add topic (maybe auto-add missing topics)
 * - Full Consumer functionality
 * - Full Producer functionality
 * - Admin api
 * - Refactoring
 * - Abstraction of options to be interchangeable with rabbitmq/redis
 */

/**
 * Purpose: to produce new Kafka message broker with async code.
 * @param connection
 * @param topics
 * @returns Kafka object to be used as a message broker
 */
export async function createKafkaClass(
  connection: KafkaClientOptions,
  topics: KafkaTopic,
  producerOptions?: ProducerOptions,
  callback?: ErrorCallback
): Promise<Kafka>;
export async function createKafkaClass(
  connection: KafkaClientOptions,
  topics: KafkaTopic,
  producerOptions?: ProducerOptions
): Promise<Kafka>;
export async function createKafkaClass(
  connection: KafkaClientOptions,
  topics: KafkaTopic,
  callback?: ErrorCallback
): Promise<Kafka>;
export async function createKafkaClass(
  connection: KafkaClientOptions,
  topics: KafkaTopic,
  producerOptionsOrCallback?: ProducerOptions | ErrorCallback,
  callback?: ErrorCallback
) {
  let producerOptions: ProducerOptions | undefined;
  if (
    typeof producerOptionsOrCallback === 'object' ||
    producerOptionsOrCallback === undefined
  ) {
    producerOptions = producerOptionsOrCallback;
  } else {
    callback = producerOptionsOrCallback;
  }

  const kafka = await new Promise((d) =>
    d(new Kafka(connection, topics, producerOptions, callback))
  );
  return kafka;
}

/**
 * An abstraction to the kafka-node library.
 * @param topics Kafka topics
 * @param host Kafka host
 * @param options Kafka client options
 * @param callback Callback to be called when the producer has connected to kafka.
 */
export default class Kafka extends MessageBroker {
  private topics: KafkaTopic;
  private client: KafkaClient;
  private producer: Producer;
  private consumers: {
    [topic: string]: Consumer;
  };
  private host: string;
  constructor(
    connection: KafkaClientOptions,
    topics: KafkaTopic,
    producerOptions?: ProducerOptions,
    callback?: ErrorCallback
  );
  constructor(
    connection: KafkaClientOptions,
    topics: KafkaTopic,
    producerOptions?: ProducerOptions
  );
  constructor(
    connection: KafkaClientOptions,
    topics: KafkaTopic,
    callback?: ErrorCallback
  );
  constructor(connection: KafkaClientOptions, topics: KafkaTopic);
  constructor(
    connection: KafkaClientOptions,
    topics: KafkaTopic,
    producerOptionsOrCallback?: ProducerOptions | ErrorCallback,
    callback?: ErrorCallback
  ) {
    let producerOptions: ProducerOptions | undefined;
    if (
      typeof producerOptionsOrCallback === 'object' ||
      producerOptionsOrCallback === undefined
    ) {
      producerOptions = producerOptionsOrCallback;
    } else {
      callback = producerOptionsOrCallback;
    }

    super(connection, topics);

    this.topics = topics;
    this.host = `${connection.host}:${connection.port}`;

    this.client = new KafkaClient({
      ...producerOptions,
      kafkaHost: this.host,
    });

    this.producer = new Producer(this.client, producerOptions);
    this.consumers = {};

    // Invoke the provided callback when the producer is ready or if there is an error.
    if (callback !== undefined) {
      this.producer.on('ready', () => callback!(null));
      this.producer.on('error', callback);
    }
  }

  /**
   * Sends a message to a provided topic.
   * @param topic The topic to send a message to.
   * @param message The message to send to a topic.
   * @param callback The callback to invoke when the message has been sent or errors out.
   */
  send(
    topic: string,
    message: string,
    options: KafkaSendOptions,
    callback: ErrorCallback
  ): void;
  send(topic: string, message: string, options: KafkaSendOptions): void;
  send(topic: string, message: string, callback: ErrorCallback): void;
  send(topic: string, message: string): void;
  send(
    topic: string,
    message: string,
    optionsOrCallback?: KafkaSendOptions | ErrorCallback,
    callback?: ErrorCallback
  ) {
    let options: KafkaSendOptions | undefined;
    if (
      typeof optionsOrCallback === 'object' ||
      optionsOrCallback === undefined
    ) {
      options = optionsOrCallback;
    } else {
      callback = optionsOrCallback;
    }

    this.producer.send(
      [
        {
          topic,
          messages: message,
          ...(options ?? {}),
        },
      ],
      callback ?? (() => {})
    );
  }

  /**
   * Creates a listener for provided topics.
   * @param topics The topics to create listeners for.
   * @param options Options for the consumer.
   */
  protected listener(topic: string, options?: KafkaListenerOptions) {
    // Format the provided topic strings to the accepted topic type for Consumer().
    const formattedTopic = {
      topic,
      ...this.topics[topic],
    };
    // Is the topic valid?
    if (!this.topics.hasOwnProperty(topic))
      throw new Error(`There is no registered topic "${topic}"`);

    this.consumers[topic] = new Consumer(
      this.client,
      [formattedTopic],
      options ?? {}
    );
  }

  /**
   * Subscribes a function to a topic's message event.
   * @param topic The topic you want to listen to
   * @param callback The function to invoke when a message is received
   */
  consume(topic: string, callback: MessageCallback<KafkaMessage | null>): void;
  consume(
    topic: string,
    listenerOptions: KafkaListenerOptions,
    callback: MessageCallback<KafkaMessage | null>
  ): void;
  consume(
    topic: string,
    optionsOrCallback?:
      | KafkaListenerOptions
      | MessageCallback<KafkaMessage | null>,
    callback?: MessageCallback<KafkaMessage | null>
  ): void {
    let listenerOptions;
    if (
      typeof optionsOrCallback === 'object' ||
      optionsOrCallback === undefined
    ) {
      listenerOptions = optionsOrCallback;
    } else {
      callback = optionsOrCallback;
    }

    if (!topic) throw new Error('No topic specified.');
    this.listener(topic, listenerOptions);
    if (!this.consumers[topic])
      throw new Error(`No listener found for topic "${topic}"`);

    this.consumers[topic]!.on('message', (msg: Message) =>
      callback!(null, formatMessageToKafkaMessage(msg))
    );
    this.consumers[topic]!.on('error', (err: any) => callback!(err, null));
  }
}
