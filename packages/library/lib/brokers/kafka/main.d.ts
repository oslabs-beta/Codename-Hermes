import { ConsumerOptions, KafkaClientOptions, Message, ProducerOptions } from 'kafka-node';
import { Topic } from '../../types/kafka';
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
    private topics;
    private options?;
    private client;
    private producer;
    private consumers;
    constructor(topics: Topic, host: string, callback?: (err?: any) => void, options?: KafkaClientOptions & ProducerOptions);
    /**
     * Sends a message to a provided topic.
     * @param topic The topic to send a message to.
     * @param message The message to send to a topic.
     * @param callback The callback to invoke when the message has been sent or errors out.
     */
    send(topic: string, message: string, callback?: (err?: string) => void): void;
    /**
     * Creates a listener for provided topics.
     * @param topics The topics to create listeners for.
     * @param options Options for the consumer.
     */
    listener(topics: string[], options?: ConsumerOptions): void;
    /**
     * Subscribes a function to a topic's message event.
     * @param topic The topic you want to listen to
     * @param callback The function to invoke when a message is received
     */
    onMessage(topic: string, callback: (message: Message) => void): void;
}
