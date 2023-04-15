import { Message, Topic } from 'kafka-node';
import { KafkaMessage, KafkaTopic } from '../main';

/**
 * Convert from KafkaTopic to kafka-node's Topic
 */
export const formatTopics = (topics: KafkaTopic): Topic[] =>
  Object.keys(topics).map((topicName) => ({
    topic: topicName,
    ...topics[topicName],
  }));

/**
 * Convert from kafka-node's Message to our KafkaMessage
 */
export const formatMessageToKafkaMessage = (
  message: Message
): KafkaMessage => ({
  topic: message.topic,
  // We will add support for Buffers in the near future
  message: Buffer.isBuffer(message.value)
    ? message.value.toString()
    : message.value,
  offset: message.offset,
  partition: message.partition,
  highWaterOffset: message.highWaterOffset,
  // We will add support for Buffers in the near future
  key: Buffer.isBuffer(message.key) ? message.key.toString() : message.key,
});
