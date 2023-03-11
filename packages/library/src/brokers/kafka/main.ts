import {
  Consumer,
  ConsumerOptions,
  KafkaClient,
  KafkaClientOptions,
  Message,
  Producer,
  ProducerOptions,
} from 'kafka-node';
import { Topic } from '../../types/kafka';

//TODO: error handling lol
//TODO: comments lol
//TODO: unified class interface for kafka, rabbitmq, and redis

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
  send(topic: string, message: string, callback?: (err?: string) => void) {
    this.producer.send(
      [
        {
          topic,
          messages: message,
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
      // TODO: fix this
      if (!that.topics[topic] && that.topics[topic] !== null)
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
  onMessage(
    topic: string,
    callback: (message: Message | null, err?: any) => void
  ) {
    if (!topic) throw new Error('No topic specified.');
    if (!this.consumers[topic])
      throw new Error(`No listener found for topic "${topic}"`);
    this.consumers[topic]!.on('message', (msg) => callback(msg, null));
    this.consumers[topic]!.on('error', (err) => callback(null, err));
  }
}
