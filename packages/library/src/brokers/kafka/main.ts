import {
  Consumer,
  ConsumerGroup,
  ConsumerOptions,
  KafkaClient,
  KafkaClientOptions,
  Message,
  Producer,
  ProduceRequest,
  ProducerOptions,
} from 'kafka-node';
import MessageBroker from '../MessageBroker';

type Topic = {
  [name: string]: null | {
    partition?: number;
    offset?: number;
  };
};

type MessageCallback = (message: Message | null, err?: any) => void;
type ErrorCallback = (err?: any) => void;
type BiDiCallback = (
  message: Message | null,
  done: (message: string) => void,
  err?: any
) => void;
type BiDiMessageData = {
  secret: string;
  message: string;
  point: 'send' | 'recv';
};
type SendOptions = {
  key?: string | Buffer;
  partition?: number;
  attributes?: number;
};

//TODO: error handling lol
//TODO: comments lol
//TODO: unified class interface for kafka, rabbitmq, and redis (config options, broker host, etc)
//TODO: kafka cluster host support
//TODO: convert to promise based
//TODO: clarify error messages.
//TODO: use types in seperate file
//TODO: REFACTOR: Everything needed to create a new KafkaClient should be encapsulated in a class-wide config.

/**
 * TODO:
 * - ConsumerStream
 * - ProducerStream
 * - Bi-directional communication
 * - Add topic (maybe auto-add missing topics)
 * - Full Consumer functionality
 * - Full Producer functionality
 * - Refactoring
 * - Abstraction of options to be interchangeable with rabbitmq/redis
 */

/**
 * An abstraction to the kafka-node library.
 * @param topics Kafka topics
 * @param host Kafka host
 * @param options Kafka client options
 * @param callback Callback to be called when the producer has connected to kafka.
 */
export default class CHKafka {
  private topics: Topic;
  private options?: KafkaClientOptions & ProducerOptions;
  private client: KafkaClient;
  private host: string;
  private producer: Producer;
  private consumers: {
    [topic: string]: Consumer;
  };

  constructor(
    topics: Topic,
    host: string,
    callback?: (err?: any) => void,
    options?: KafkaClientOptions & ProducerOptions
  ) {
    this.topics = topics;
    this.options = options ?? {};

    this.client = new KafkaClient({
      ...options,
      kafkaHost: host,
    });

    this.producer = new Producer(this.client, options);
    this.consumers = {};

    this.host = host;

    // Invoke the provided callback when the producer is ready or if there is an error.
    if (callback) {
      this.producer.on('ready', callback);
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
    callback?: ErrorCallback,
    options?: SendOptions
  ) {
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
  listener(topics: string[], options?: ConsumerOptions) {
    // Just so we still have access to "this" in the map and forEach methods.
    const that = this;

    // Format the provided topic strings to the accepted topic type for Consumer().
    const formattedTopics = topics.map((topic) => {
      // Is the topic valid?
      if (!this.topics.hasOwnProperty(topic))
        throw new Error(`There is no registered topic "${topic}"`);

      // Cool it is, let's format.
      return {
        topic,
        ...that.topics[topic],
      };
    });

    // Create new Consumers for each topic.
    formattedTopics.forEach((topic) => {
      that.consumers[topic.topic] = new Consumer(
        that.client,
        [topic],
        options ?? {}
      );
    });
  }

  /**
   * Subscribes a function to a topic's message event.
   * @param topic The topic you want to listen to
   * @param callback The function to invoke when a message is received
   */
  onMessage(topic: string, callback: MessageCallback) {
    if (!topic) throw new Error('No topic specified.');
    if (!this.consumers[topic])
      throw new Error(`No listener found for topic "${topic}"`);
    this.consumers[topic]!.on('message', (msg) => callback(msg, null));
    this.consumers[topic]!.on('error', (err) => callback(null, err));
  }
}
