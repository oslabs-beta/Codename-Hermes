import MessageBroker, {
  GenericClientOptions,
  GenericListenerOptions,
  GenericMessage,
  GenericTopic,
  MessageCallback,
} from '../MessageBroker';

export type RabbitClientOptions = GenericClientOptions;

// TODO: add the rest of the options
export type RabbitTopic = GenericTopic<{
  exclusive?: boolean;
  durable?: boolean;
  autoDelete?: boolean;
  messageTtl?: number;
}>;

export type RabbitListenerOptions = GenericListenerOptions & {};

export type RabbitMessage = GenericMessage & {};

export default class Rabbit extends MessageBroker {
  constructor(connection: RabbitClientOptions, topics: RabbitTopic) {
    super(connection, topics);
  }

  send(topic: string, message: string | string[]) {}

  listener(topics: string[], options: RabbitListenerOptions) {}

  consume(topic: string, callback: MessageCallback<RabbitMessage>) {}
}
