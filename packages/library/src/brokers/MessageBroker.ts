// The Message type should be created by us at a later point. It must be compatible with Kafka and
export type MessageCallback<T> = (err: any, message: T) => void;
export type ErrorCallback = (err: any) => void;

// export type GenericTopicOptions = {
// };

// A generic topic layout
//
export type GenericTopic<T = any> = {
  [topicName: string]: T;
};

// The generic options for "listeners"
// Each broker will have their own specific options as well.
// TODO: this
export type GenericListenerOptions = {
  autoCommit?: boolean;
};

// Kafka - Rabbit simularities
// groupId = NULL
// autoCommit = noAck
// autoCommitIntervalMs = NULL
// fetchMaxWaitMs = NULL
// fetchMinBytes = NULL
// fetchMaxBytes = NULL
// fromOffset = NULL

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

// TODO: add overloads to abstract class.

export default abstract class MessageBroker {
  constructor(connection: GenericClientOptions, topics: GenericTopic) {}

  // This will be defined in the specific broker class
  abstract send(topic: string, message: string | string[]): void;

  // This will be defined in the specific broker class
  protected abstract listener(
    topics: string,
    options?: GenericListenerOptions
  ): void;

  // This will be defined in the specific broker class
  // abstract consume(topic: string): Promise<GenericMessage | null>;
  abstract consume(
    topic: string,
    listenerOptions: GenericListenerOptions,
    callback: MessageCallback<any>
  ): void;
}
