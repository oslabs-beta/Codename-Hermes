import MessageBroker, {
  GenericClientOptions,
  GenericListenerOptions,
  GenericMessage,
  GenericTopic,
} from '../MessageBroker';
import { RetryOptions } from 'kafka-node';

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

export type KafkaTopic = GenericTopic<{
  partition?: number;
  offset?: number;
}>;

export default class Kafka extends MessageBroker {
  constructor(connection: KafkaClientOptions, topics: KafkaTopic) {
    super(connection, topics);
  }

  listener(
    topics: string[],
    options: GenericListenerOptions | GenericListenerOptions[]
  ): void {
    throw new Error('Method not implemented.');
  }

  send(topic: string, message: string | string[]): void {
    throw new Error('Method not implemented.');
  }

  consume(
    topic: string,
    callback?: Function | undefined
  ): void | Promise<GenericMessage> {
    throw new Error('Method not implemented.');
  }
}
