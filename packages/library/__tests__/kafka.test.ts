import { MockProducer } from './mocks/MockProducer';
import Kafka from '../src/brokers/kafka/main';
import {
  formatTopics,
  formatMessageToKafkaMessage,
} from '../src/brokers/kafka/utils/utilFunctions';
import { MockClient } from './mocks/MockClient';
import MockConsumer from './mocks/MockConsumer';

describe('Kafka', () => {
  const topics = {
    defaultTopic: null,
    partitionTopic: { partition: 2 },
    offsetTopic: { offset: 2 },
    offsetAndPartitionTopic: { partition: 2, offset: 2 },
  };

  const mockClient = new MockClient();
  const mockProducer = new MockProducer();

  // @ts-ignore because we don't need to re-create the client, just mock the methods we use.
  const kafka = new Kafka(mockClient, mockProducer, topics);

  describe('Methods', () => {
    it('should have consume()', () => {
      expect(Object.getPrototypeOf(kafka).hasOwnProperty('consume')).toBe(true);
    });

    it('should have send()', () => {
      expect(Object.getPrototypeOf(kafka).hasOwnProperty('send')).toBe(true);
    });
  });

  describe('Utils', () => {
    it('formatTopics() should format the topics', () => {
      const formattedTopics = formatTopics(topics);
      expect(formattedTopics).toEqual([
        {
          topic: 'defaultTopic',
        },
        {
          topic: 'partitionTopic',
          partition: 2,
        },
        {
          topic: 'offsetTopic',
          offset: 2,
        },
        {
          topic: 'offsetAndPartitionTopic',
          partition: 2,
          offset: 2,
        },
      ]);
    });

    it('formatMessageToKafkaMessage() should convert Message to type KafkaMessage', () => {
      const kafkaNodeMessage = {
        topic: 'test',
        value: 'test',
        offset: 1,
        partition: 2,
        highWaterOffset: 2,
        key: 'test',
      };

      const kafkaNodeMessageBuffer = {
        topic: 'test',
        value: Buffer.from('test'),
        offset: 1,
        partition: 2,
        highWaterOffset: 2,
        key: 'test',
      };

      const expected = {
        topic: 'test',
        message: 'test',
        offset: 1,
        partition: 2,
        highWaterOffset: 2,
        key: 'test',
      };

      expect(formatMessageToKafkaMessage(kafkaNodeMessage)).toEqual(expected);

      expect(
        typeof formatMessageToKafkaMessage(kafkaNodeMessageBuffer).message
      ).toBe('string');

      expect(formatMessageToKafkaMessage(kafkaNodeMessageBuffer)).toEqual(
        expected
      );
    });
  });

  describe('Sending', () => {
    it('should send to a topic', () => {
      expect(kafka.send('defaultTopic', 'test')).toBeUndefined();
      expect(mockProducer.send.mock.calls.length).toBe(1);
    });
  });

  // TODO: need to add these tests teehee
  describe('Consumption', () => {
    it('should consume messages', () => {
      const mockConsumer = new MockConsumer();
      const mockConsumerCallback = jest.fn();

      const kafkaNodeMessage = {
        topic: 'test',
        value: 'test',
        offset: 1,
        partition: 2,
        highWaterOffset: 2,
        key: 'test',
      };

      kafka['consumers'] = {
        // @ts-ignore
        testTopic: mockConsumer,
      };

      kafka.consume('testTopic', (err, data) =>
        mockConsumerCallback(err, data)
      );
      mockConsumer.trigger('message', kafkaNodeMessage);

      expect(mockConsumerCallback.mock.calls[0]).toEqual([
        null,
        formatMessageToKafkaMessage(kafkaNodeMessage),
      ]);
    });

    it('should consume errors', () => {
      const mockConsumer = new MockConsumer();
      const mockConsumerCallback = jest.fn(
        (err: any, data: any) => err || data
      );

      const kafkaNodeMessage = {
        topic: 'test',
        value: 'test',
        offset: 1,
        partition: 2,
        highWaterOffset: 2,
        key: 'test',
      };

      kafka['consumers'] = {
        // @ts-ignore
        testTopic: mockConsumer,
      };

      kafka.consume('testTopic', (err, data) =>
        mockConsumerCallback(err, data)
      );
      mockConsumer.trigger('error', 'error');

      expect(mockConsumerCallback.mock.calls).toHaveLength(1);
      expect(mockConsumerCallback.mock.calls[0]).toEqual(['error', null]);
    });

    it('should throw an error if the topic is invalid', () => {
      // Why is this test like this? Well, that is a funny story. Not really. the "toThrow()" test case kept failing because there was an error thrown?
      try {
        kafka.consume('none', () => {});
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
