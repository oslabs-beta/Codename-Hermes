import { Message } from 'kafka-node';

// The Message type should be created by us at a later point. It must be compatible with Kafka and
export type MessageCallback = (message: Message | null, err?: any) => void;
export type ErrorCallback = (err?: any) => void;

// export type GenericTopicOptions = {
// };

// A generic topic layout
//
export type GenericTopic<T = any> = {
  [topicName: string]: null | T;
};

// The generic options for "listeners"
// Each broker will have their own specific options as well.
export type GenericListenerOptions = {};

// The generic client options for every broker.
// Each broker will have their own specific options as well.
export type GenericClientOptions = {
  host: string;
  port?: number;
};

// The generic message object
// Each broker will have their own specific details added.
export type GenericMessage = {
  topic: string;
  message: string;
};

export default abstract class MessageBroker {
  constructor(connection: GenericClientOptions, topics: GenericTopic) {}

  // This will be defined in the specific broker class
  abstract listener(
    topics: string[],
    options: GenericListenerOptions | GenericListenerOptions[]
  ): void;

  // This will be defined in the specific broker class
  abstract send(topic: string, message: string | string[]): void;

  // This will be defined in the specific broker class
  abstract consume(
    topic: string,
    callback?: Function
  ): void | Promise<GenericMessage>;
}
